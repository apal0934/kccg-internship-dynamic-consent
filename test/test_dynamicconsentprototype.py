import pytest
from mongoengine import connect, disconnect_all
from starlette.testclient import TestClient

from dynamicconsentprototype.main import app


@pytest.fixture()
def db():
    conn = connect("mongoenginetest", host="mongomock://localhost")

    def teardown():
        conn.drop_database("mongoenginetest")
        disconnect_all()


client = TestClient(app)


def test_server_running():
    response = client.get("/")
    assert response.status_code == 400
    assert response.text == "No GraphQL query found in the request"


def test_consent_create(db):
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


def test_user_create(db):
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


def test_user_update(db):
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


def test_consent_update(db):
    payload = '{"query":"mutation {\\n  createConsent(name: \\"Test\\", purpose: \\"Research\\", commercial: true) {\\n    consent {\\n     id\\n    name\\n      purpose\\n      commercial\\n    }\\n  }\\n}\\n"}'
    headers = {"content-type": "application/json"}
    res = client.post("/", headers=headers, data=payload)
    ID = res.json()["data"]["createConsent"]["consent"]["id"]
    payload = (
        '{"query":"mutation {\\n  updateConsent(id: \\"%s\\", name:  \\"Passed\\", purpose: \\"Testing\\", commercial: false) {\\n    consent {\\n name\\n     purpose\\n      commercial\\n      }\\n  }\\n}\\n"}'
        % ID
    )
    res = client.post("/", headers=headers, data=payload)
    print(res.text)
    assert res.status_code == 200
    assert res.json() == {
        "data": {
            "updateConsent": {
                "consent": {"name": "Passed", "purpose": "Testing", "commercial": False}
            }
        },
        "errors": None,
    }
