"""Tests for the professional-report features added in v1.2.0:
custom CSS themes, user finding templates, and the extended report/finding fields.
"""


class TestThemes:
    def test_create_and_list_custom_theme(self, client):
        payload = {
            "slug": "midnight",
            "name": "Midnight",
            "base": "dark",
            "vars": {"--rt-pageBg": "#000000", "--rt-textHeading": "#9fef00"},
        }
        r = client.post("/api/themes", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["slug"] == "midnight"
        assert data["vars"]["--rt-pageBg"] == "#000000"
        assert data["is_builtin"] == 0

        lst = client.get("/api/themes").json()
        assert any(t["slug"] == "midnight" for t in lst)

    def test_reserved_slug_rejected(self, client):
        r = client.post("/api/themes", json={"slug": "dark", "name": "X", "vars": {}})
        assert r.status_code == 400

    def test_invalid_slug_rejected(self, client):
        r = client.post("/api/themes", json={"slug": "Bad Slug!", "name": "X", "vars": {}})
        assert r.status_code == 422

    def test_css_injection_sanitized(self, client):
        payload = {
            "slug": "evil",
            "name": "Evil",
            "vars": {
                "--rt-pageBg": "#fff",
                "--rt-bad": "red; } body { display:none }",  # value rechazado
                "background": "url(http://evil)",            # clave fuera de namespace
            },
        }
        data = client.post("/api/themes", json=payload).json()
        assert data["vars"] == {"--rt-pageBg": "#fff"}

    def test_custom_css_saved_and_sanitized(self, client):
        css = (
            ".finding-preview h3 { color: #08c; }\n"
            "@import url(http://evil.com/x.css);\n"
            ".x { background: url(http://evil.com/p.png); }\n"
            ".y { background: url(data:image/png;base64,AAA); }\n"
            "</style><script>alert(1)</script>\n"
            ".z { behavior: url(#default); width: expression(alert(1)); }"
        )
        data = client.post("/api/themes", json={
            "slug": "css-theme", "name": "CSS", "vars": {}, "custom_css": css
        }).json()
        out = data["custom_css"]
        assert ".finding-preview h3 { color: #08c; }" in out
        assert "@import" not in out
        assert "http://evil.com" not in out          # url() externas neutralizadas
        assert "data:image/png;base64,AAA" in out     # data: se conserva
        assert "<" not in out and ">" not in out      # sin etiquetas HTML
        assert "expression(" not in out
        assert "behavior:" not in out

    def test_upsert_same_slug(self, client):
        client.post("/api/themes", json={"slug": "t1", "name": "A", "vars": {}})
        client.post("/api/themes", json={"slug": "t1", "name": "B", "vars": {"--rt-pageBg": "#111"}})
        themes = [t for t in client.get("/api/themes").json() if t["slug"] == "t1"]
        assert len(themes) == 1
        assert themes[0]["name"] == "B"

    def test_delete_theme(self, client):
        tid = client.post("/api/themes", json={"slug": "tmp", "name": "Tmp", "vars": {}}).json()["id"]
        assert client.delete(f"/api/themes/{tid}").status_code == 200
        assert all(t["id"] != tid for t in client.get("/api/themes").json())


class TestFindingTemplates:
    def test_create_list_delete(self, client):
        payload = {
            "slug": "my-sqli",
            "name": "My SQLi",
            "title": "Inyección SQL",
            "severity": "crit",
            "cvss": "9.8",
            "owasp": "A03:2021",
        }
        r = client.post("/api/finding-templates", json=payload)
        assert r.status_code == 200, r.text
        tid = r.json()["id"]

        lst = client.get("/api/finding-templates").json()
        assert any(t["slug"] == "my-sqli" and t["severity"] == "crit" for t in lst)

        assert client.delete(f"/api/finding-templates/{tid}").status_code == 200


class TestExtendedFields:
    def _make_report(self, client):
        return client.post("/api/reports", json={
            "document_title": "T",
            "audit_type": "caja_negra",
            "scope_in": "https://app.example.com",
            "scope_out": "10.0.0.0/8",
            "methodology_standards": ["owasp_wstg", "ptes"],
            "tools_used": "Burp, nmap",
            "engagement_start": "2026-01-01",
            "engagement_end": "2026-01-10",
            "revision_history": [
                {"version": "1.0", "date": "2026-01-10", "author": "Mario", "changes": "Versión inicial"}
            ],
        }).json()

    def test_report_pro_fields_persist(self, client):
        rid = self._make_report(client)["id"]
        got = client.get(f"/api/reports/{rid}").json()
        assert got["audit_type"] == "caja_negra"
        assert got["scope_in"] == "https://app.example.com"
        assert got["methodology_standards"] == ["owasp_wstg", "ptes"]
        assert got["revision_history"][0]["author"] == "Mario"

    def test_finding_pro_fields_persist(self, client):
        rid = self._make_report(client)["id"]
        payload = {
            "title": "IDOR",
            "severity": "high",
            "cvss": "8.1",
            "cvss_vector": "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N",
            "status": "remediated",
            "affected_assets": "/api/users/{id}",
            "likelihood": "high",
            "impact_rating": "med",
            "owasp": "A01:2021",
            "references": ["https://owasp.org/Top10/A01", "  ", "https://cwe.mitre.org/"],
            "compliance": ["PCI 6.5.8", "ISO A.9"],
            "retest_notes": "Corregido en sprint 12",
        }
        f = client.post(f"/api/reports/{rid}/findings", json=payload).json()
        assert f["cvss_vector"].startswith("CVSS:3.1")
        assert f["status"] == "remediated"
        # La referencia en blanco se descarta al sanear la lista.
        assert f["references"] == ["https://owasp.org/Top10/A01", "https://cwe.mitre.org/"]
        assert f["compliance"] == ["PCI 6.5.8", "ISO A.9"]
        assert f["owasp"] == "A01:2021"

        got = client.get(f"/api/reports/{rid}").json()
        assert got["findings"][0]["affected_assets"] == "/api/users/{id}"
