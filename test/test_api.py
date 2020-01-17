from mongoengine import connect, disconnect_all
from mongoengine.connection import _get_db
from starlette.testclient import TestClient

from dynamic_consent_backend.main import app


def setup_function(function):
    connect("mongoenginetest", host="mongomock://localhost")


def teardown_function(function):
    conn = _get_db()
    for collection in conn.list_collection_names():
        conn.drop_collection(collection)
    disconnect_all


client = TestClient(app)


def test_server_running():
    response = client.get("/")
    assert response.status_code == 400
    assert response.text == "No GraphQL query found in the request"


def test_consent_create():
    payload = '{"query":"mutation {\\n  createConsent(name: \\"Test\\", purpose: \\"Research\\", commercial: true) {\\n    consent {\\n      name\\n      purpose\\n      commercial\\n    }\\n  }\\n}\\n"}'
    headers = {"content-type": "application/json"}
    response = client.post("/", headers=headers, data=payload)
    assert response.status_code == 200
    assert response.json() == {
        "data": {
            "createConsent": {
                "consent": {"name": "Test", "purpose": "Research", "commercial": True}
            }
        },
        "errors": None,
    }
    payload = '{"query":"{\\n  consents {\\n    name\\n    purpose\\n    commercial\\n  }\\n}\\n"}'
    response = client.post("/", headers=headers, data=payload)
    assert response.json() == {
        "data": {
            "consents": [{"name": "Test", "purpose": "Research", "commercial": True}]
        },
        "errors": None,
    }


def test_user_create():
    payload = '{"query":"mutation {\\n  createUser(email: \\"test@test.com\\", firstName: \\"Test\\", lastName: \\"User\\") {\\n    user {\\n      email\\n      firstName\\n      lastName\\n    }\\n  }\\n}\\n"}'
    headers = {"content-type": "application/json"}
    response = client.post("/", headers=headers, data=payload)
    assert response.status_code == 200
    assert response.json() == {
        "data": {
            "createUser": {
                "user": {
                    "email": "test@test.com",
                    "firstName": "Test",
                    "lastName": "User",
                }
            }
        },
        "errors": None,
    }
    payload = '{"query":"{\\n  users {\\n    email\\n    firstName\\n    lastName\\n  }\\n}\\n"}'
    response = client.post("/", headers=headers, data=payload)
    assert response.json() == {
        "data": {
            "users": [
                {"email": "test@test.com", "firstName": "Test", "lastName": "User"}
            ]
        },
        "errors": None,
    }


def test_user_update():
    payload = '{"query":"mutation {\\n  createUser(email: \\"test@test.com\\", firstName: \\"Test\\", lastName: \\"User\\") {\\n    user {\\n      id\\n firstName\\n    }\\n  }\\n}\\n"}'
    headers = {"content-type": "application/json"}
    res = client.post("/", headers=headers, data=payload)
    ID = res.json()["data"]["createUser"]["user"]["id"]
    payload = (
        '{"query":"mutation {\\n  updateUser(id: \\"%s\\", email:  \\"passed@test.com\\", firstName: \\"Passed\\", lastName: \\"the Test\\") {\\n    user {\\n      email\\n      firstName\\n      lastName\\n    }\\n  }\\n}\\n"}'
        % ID
    )
    res = client.post("/", headers=headers, data=payload)
    assert res.status_code == 200
    assert res.json() == {
        "data": {
            "updateUser": {
                "user": {
                    "email": "passed@test.com",
                    "firstName": "Passed",
                    "lastName": "the Test",
                }
            }
        },
        "errors": None,
    }


def test_user_add_consents():
    payload = '{"query":"mutation {\\n  createConsent(name: \\"Test\\", purpose: \\"Research\\", commercial: false) {\\n    consent {\\n     id\\n    name\\n      purpose\\n      commercial\\n    }\\n  }\\n}\\n"}'
    headers = {"content-type": "application/json"}
    res = client.post("/", headers=headers, data=payload)
    consent_id = res.json()["data"]["createConsent"]["consent"]["id"]
    payload = '{"query":"mutation {\\n  createUser(email: \\"test@test.com\\", firstName: \\"Test\\", lastName: \\"User\\") {\\n    user {\\n      id\\n firstName\\n    }\\n  }\\n}\\n"}'
    res = client.post("/", headers=headers, data=payload)
    user_id = res.json()["data"]["createUser"]["user"]["id"]
    payload = (
        '{"query":"mutation {\\n  addConsents(userId: \\"%s\\", consentIds: [\\"%s\\"]) {\\n    user {\\n      firstName\\n      consents {\\n        name\\n purpose \\n commercial \\n      }\\n    }\\n  }\\n}\\n"}'
        % (user_id, consent_id)
    )
    res = client.post("/", headers=headers, data=payload)
    assert res.status_code == 200
    assert res.json() == {
        "data": {
            "addConsents": {
                "user": {
                    "firstName": "Test",
                    "consents": [
                        {"name": "Test", "purpose": "Research", "commercial": False}
                    ],
                }
            }
        },
        "errors": None,
    }


def test_user_revoke_consents():
    payload = '{"query":"mutation {\\n  createConsent(name: \\"Test\\", purpose: \\"Research\\", commercial: true) {\\n    consent {\\n     id\\n    name\\n      purpose\\n      commercial\\n    }\\n  }\\n}\\n"}'
    headers = {"content-type": "application/json"}
    res = client.post("/", headers=headers, data=payload)
    consent_id = res.json()["data"]["createConsent"]["consent"]["id"]
    payload = (
        '{"query":"mutation {\\n  createUser(email: \\"test@test.com\\", firstName: \\"Test\\", lastName: \\"User\\", consents: \\"%s\\") {\\n    user {\\n      id\\n firstName\\n    }\\n  }\\n}\\n"}'
        % consent_id
    )
    res = client.post("/", headers=headers, data=payload)
    user_id = res.json()["data"]["createUser"]["user"]["id"]
    payload = (
        '{"query":"mutation {\\n  revokeConsents(userId: \\"%s\\", consentIds: [\\"%s\\"]) {\\n    user {\\n      firstName\\n      consents {\\n        name\\n purpose \\n commercial \\n      }\\n    }\\n  }\\n}\\n"}'
        % (user_id, consent_id)
    )
    res = client.post("/", headers=headers, data=payload)
    assert res.status_code == 200
    assert res.json() == {
        "data": {"revokeConsents": {"user": {"firstName": "Test", "consents": []}}},
        "errors": None,
    }


def test_consent_update():
    payload = '{"query":"mutation {\\n  createConsent(name: \\"Test\\", purpose: \\"Research\\", commercial: true) {\\n    consent {\\n     id\\n    name\\n      purpose\\n      commercial\\n    }\\n  }\\n}\\n"}'
    headers = {"content-type": "application/json"}
    res = client.post("/", headers=headers, data=payload)
    ID = res.json()["data"]["createConsent"]["consent"]["id"]
    payload = (
        '{"query":"mutation {\\n  updateConsent(id: \\"%s\\", name:  \\"Passed\\", purpose: \\"Testing\\", commercial: false) {\\n    consent {\\n name\\n     purpose\\n      commercial\\n      }\\n  }\\n}\\n"}'
        % ID
    )
    res = client.post("/", headers=headers, data=payload)
    assert res.status_code == 200
    assert res.json() == {
        "data": {
            "updateConsent": {
                "consent": {"name": "Passed", "purpose": "Testing", "commercial": False}
            }
        },
        "errors": None,
    }


def test_user_delete():
    payload = '{"query":"mutation {\\n  createUser(email: \\"test@test.com\\", firstName: \\"Test\\", lastName: \\"User\\") {\\n    user {\\n      id\\n firstName\\n    }\\n  }\\n}\\n"}'
    headers = {"content-type": "application/json"}
    res = client.post("/", headers=headers, data=payload)
    ID = res.json()["data"]["createUser"]["user"]["id"]
    payload = (
        '{"query":"mutation {\\n  deleteUser(id: \\"%s\\"){\\n    user {\\n      firstName\\n    }\\n  }\\n}\\n"}'
        % ID
    )
    res = client.post("/", headers=headers, data=payload)
    assert res.status_code == 200
    payload = '{"query":"{\\n  users {\\n    email\\n    firstName\\n    lastName\\n  }\\n}\\n"}'
    res = client.post("/", headers=headers, data=payload)
    assert res.json() == {"data": {"users": []}, "errors": None}


def test_consent_delete():
    payload = '{"query":"mutation {\\n  createConsent(name: \\"Test\\", purpose: \\"Research\\", commercial: true) {\\n    consent {\\n     id\\n    name\\n      purpose\\n      commercial\\n    }\\n  }\\n}\\n"}'
    headers = {"content-type": "application/json"}
    res = client.post("/", headers=headers, data=payload)
    ID = res.json()["data"]["createConsent"]["consent"]["id"]
    payload = (
        '{"query":"mutation {\\n  deleteConsent(id: \\"%s\\"){\\n    consent {\\n      name\\n    }\\n  }\\n}\\n"}'
        % ID
    )
    res = client.post("/", headers=headers, data=payload)
    assert res.status_code == 200
    payload = '{"query":"{\\n  consents {\\n    name\\n    purpose\\n    commercial\\n  }\\n}\\n"}'
    res = client.post("/", headers=headers, data=payload)
    assert res.json() == {"data": {"consents": []}, "errors": None}
