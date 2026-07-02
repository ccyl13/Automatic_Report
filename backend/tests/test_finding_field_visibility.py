"""Tests para fields_visibility: visibilidad opt-in de metadatos opcionales del hallazgo.

Los campos OWASP, matriz de riesgo, cumplimiento y notas de re-test son opt-in:
solo se incluyen en el informe si su clave está a True en fields_visibility. Por
defecto el dict es {} (todos ocultos)."""

import pytest


@pytest.fixture
def report(client):
    return client.post("/api/reports", json={"document_title": "T"}).json()


def test_fields_visibility_defaults_to_empty(client, report):
    """Si se omite, fields_visibility debe ser {} (todos los opcionales ocultos)."""
    r = client.post(f"/api/reports/{report['id']}/findings",
                    json={"title": "Sin visibilidad"})
    assert r.status_code == 200
    assert r.json()["fields_visibility"] == {}


def test_fields_visibility_roundtrip(client, report):
    """El dict de visibilidad se guarda y se recupera intacto."""
    vis = {"compliance": True, "owasp": True, "risk": False, "retest": True}
    created = client.post(
        f"/api/reports/{report['id']}/findings",
        json={"title": "Con visibilidad", "compliance": ["PCI 6.5.1"],
              "owasp": "A01:2021", "fields_visibility": vis},
    ).json()
    assert created["fields_visibility"] == vis

    fetched = client.get(f"/api/reports/{report['id']}/findings").json()[0]
    assert fetched["fields_visibility"] == vis


def test_fields_visibility_update(client, report):
    """PUT actualiza el dict de visibilidad."""
    fid = client.post(f"/api/reports/{report['id']}/findings",
                      json={"title": "X"}).json()["id"]
    upd = client.put(f"/api/findings/{fid}",
                     json={"title": "X", "fields_visibility": {"compliance": True}})
    assert upd.status_code == 200
    assert upd.json()["fields_visibility"] == {"compliance": True}
