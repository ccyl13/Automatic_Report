"""
Autenticación de Pentestify.

Modelo de un solo usuario administrador. Las contraseñas se almacenan con
PBKDF2-HMAC-SHA256 (sólo stdlib, sin dependencias extra) y las sesiones usan
tokens HMAC sin estado (stateless): no hace falta tabla de sesiones y sobreviven
a reinicios del servidor. La clave de firma incluye el hash de la contraseña, de
modo que cambiarla invalida automáticamente todos los tokens previos.
"""
import base64
import hashlib
import hmac
import json
import os
import secrets
import time
from typing import Optional

from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session

import models
from database import get_db, data_dir

# Credenciales por defecto que se siembran en el primer arranque.
DEFAULT_USERNAME = "admin"
DEFAULT_PASSWORD = "admin"

COOKIE_NAME = "pentestify_session"
TOKEN_TTL = 7 * 24 * 3600  # 7 días
PBKDF2_ITERATIONS = 200_000


# --------------------------------------------------------------------------- #
# Clave secreta del servidor (para firmar tokens)
# --------------------------------------------------------------------------- #
def _load_secret() -> str:
    """Obtiene la clave de firma de SECRET_KEY o de un fichero persistente."""
    env_secret = os.environ.get("SECRET_KEY")
    if env_secret:
        return env_secret

    secret_file = os.path.join(data_dir, ".session_secret")
    if os.path.exists(secret_file):
        with open(secret_file, "r") as f:
            existing = f.read().strip()
            if existing:
                return existing

    secret = secrets.token_hex(32)
    try:
        with open(secret_file, "w") as f:
            f.write(secret)
        os.chmod(secret_file, 0o600)
    except OSError:
        # Si no se puede persistir, seguimos con la clave en memoria (los
        # tokens dejarán de ser válidos tras un reinicio, pero la app funciona).
        pass
    return secret


SECRET_KEY = _load_secret()


# --------------------------------------------------------------------------- #
# Hashing de contraseñas
# --------------------------------------------------------------------------- #
def hash_password(password: str, salt: Optional[str] = None) -> str:
    if salt is None:
        salt = secrets.token_hex(16)
    dk = hashlib.pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(salt), PBKDF2_ITERATIONS)
    return f"pbkdf2_sha256${PBKDF2_ITERATIONS}${salt}${dk.hex()}"


def verify_password(password: str, stored: str) -> bool:
    try:
        algo, iterations, salt, hexhash = stored.split("$")
        if algo != "pbkdf2_sha256":
            return False
        dk = hashlib.pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(salt), int(iterations))
        return hmac.compare_digest(dk.hex(), hexhash)
    except (ValueError, AttributeError):
        return False


# --------------------------------------------------------------------------- #
# Tokens de sesión (HMAC sin estado)
# --------------------------------------------------------------------------- #
def _b64e(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).decode().rstrip("=")


def _b64d(data: str) -> bytes:
    return base64.urlsafe_b64decode(data + "=" * (-len(data) % 4))


def _sign(payload_b64: str, password_hash: str) -> str:
    # La clave incluye el hash de la contraseña: al cambiarla, los tokens viejos
    # dejan de validar.
    key = (SECRET_KEY + password_hash).encode()
    return _b64e(hmac.new(key, payload_b64.encode(), hashlib.sha256).digest())


def create_token(user: "models.User") -> str:
    payload = {"u": user.username, "exp": int(time.time()) + TOKEN_TTL}
    payload_b64 = _b64e(json.dumps(payload, separators=(",", ":")).encode())
    return f"{payload_b64}.{_sign(payload_b64, user.password_hash)}"


def verify_token(token: str, db: Session) -> Optional["models.User"]:
    try:
        payload_b64, signature = token.split(".")
        payload = json.loads(_b64d(payload_b64))
        if int(payload.get("exp", 0)) < int(time.time()):
            return None
        user = db.query(models.User).filter(models.User.username == payload.get("u")).first()
        if not user:
            return None
        if not hmac.compare_digest(_sign(payload_b64, user.password_hash), signature):
            return None
        return user
    except (ValueError, KeyError, json.JSONDecodeError):
        return None


# --------------------------------------------------------------------------- #
# Usuario por defecto
# --------------------------------------------------------------------------- #
def get_or_create_default_user(db: Session) -> "models.User":
    user = db.query(models.User).first()
    if user is None:
        user = models.User(
            username=DEFAULT_USERNAME,
            password_hash=hash_password(DEFAULT_PASSWORD),
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


# --------------------------------------------------------------------------- #
# Dependencia de FastAPI para proteger endpoints
# --------------------------------------------------------------------------- #
def require_auth(request: Request, db: Session = Depends(get_db)) -> "models.User":
    token = None
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header[7:].strip()
    if not token:
        token = request.cookies.get(COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=401, detail="No autenticado")

    user = verify_token(token, db)
    if user is None:
        raise HTTPException(status_code=401, detail="Sesión inválida o expirada")
    return user
