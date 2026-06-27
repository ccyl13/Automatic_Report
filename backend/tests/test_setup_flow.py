"""Tests del primer arranque (sin usuario por defecto) y del borrado de cuenta.

Cubre los cambios de seguridad:
  - No existe ningún usuario por defecto (admin/admin eliminado).
  - /api/auth/needs-setup indica si la app está sin configurar.
  - /api/auth/setup crea la PRIMERA cuenta y luego queda bloqueado (409).
  - Cualquier usuario (incluido el propio) se puede borrar mientras quede otro.
"""


class TestSetupFlow:
    def test_no_default_user_on_fresh_db(self, client):
        # BD recién creada: no hay usuarios → la app pide configuración inicial.
        r = client.get("/api/auth/needs-setup")
        assert r.status_code == 200
        assert r.json()["needs_setup"] is True

        # Las credenciales por defecto admin/admin ya NO existen.
        r = client.post("/api/auth/login", json={"username": "admin", "password": "admin"})
        assert r.status_code == 401

    def test_setup_creates_first_account_then_locks(self, client):
        r = client.post("/api/auth/setup", json={"username": "owner", "password": "s3cret-pass"})
        assert r.status_code == 200
        body = r.json()
        assert body["username"] == "owner"
        assert "token" in body

        # Ya configurada: needs-setup es False y un segundo setup queda bloqueado.
        assert client.get("/api/auth/needs-setup").json()["needs_setup"] is False
        r = client.post("/api/auth/setup", json={"username": "intruder", "password": "whatever"})
        assert r.status_code == 409

        # La cuenta creada permite iniciar sesión con sus credenciales reales.
        r = client.post("/api/auth/login", json={"username": "owner", "password": "s3cret-pass"})
        assert r.status_code == 200

    def test_setup_rejects_short_password(self, client):
        # Username válido pero contraseña demasiado corta → 400 del propio endpoint.
        r = client.post("/api/auth/setup", json={"username": "validuser", "password": "ab"})
        assert r.status_code == 400
        # Tras un setup rechazado la app sigue sin configurar.
        assert client.get("/api/auth/needs-setup").json()["needs_setup"] is True

    def test_setup_rejects_invalid_username(self, client):
        # Username fuera del allowlist (anti-XSS, 3-32 chars) → 422 del schema.
        assert client.post("/api/auth/setup", json={"username": "x", "password": "abcd"}).status_code == 422
        assert client.post("/api/auth/setup", json={"username": "<script>", "password": "abcd"}).status_code == 422


class TestUserDeletion:
    def test_can_delete_self_when_other_users_exist(self, client, db_session):
        # require_auth está mockeado como el usuario id=1; creamos ese usuario y otro.
        import auth
        import models

        u1 = models.User(id=1, username="admin", password_hash=auth.hash_password("pw-admin-1"))
        u2 = models.User(id=2, username="colega", password_hash=auth.hash_password("pw-colega"))
        db_session.add_all([u1, u2])
        db_session.commit()

        # Borrar la PROPIA cuenta (id=1) es posible porque queda otra (id=2).
        r = client.delete("/api/users/1")
        assert r.status_code == 200
        assert r.json()["deleted_self"] is True

        # Con un único usuario restante, ya no se puede borrar (debe quedar uno).
        r = client.delete("/api/users/2")
        assert r.status_code == 400
