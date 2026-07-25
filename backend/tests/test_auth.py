from uuid import uuid4


def test_register_user(client):
    unique_email = f"test_{uuid4().hex}@example.com"

    response = client.post(
        "/users/register",
        json={
            "full_name": "Test User",
            "email": unique_email,
            "password": "Password123",
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["email"] == unique_email
    assert data["full_name"] == "Test User"
    assert "id" in data


def test_register_duplicate_email(client):
    email = f"duplicate_{uuid4().hex}@example.com"

    payload = {
        "full_name": "Duplicate User",
        "email": email,
        "password": "Password123",
    }

    # First registration
    response1 = client.post("/users/register", json=payload)
    assert response1.status_code == 201

    # Second registration with the same email
    response2 = client.post("/users/register", json=payload)

    assert response2.status_code == 400

    data = response2.json()

    assert "already" in data["error"]["message"].lower()

def test_login_success(client):
    email = f"login_{uuid4().hex}@example.com"

    register_payload = {
        "full_name": "Login User",
        "email": email,
        "password": "Password123",
    }

    # Register the user
    register_response = client.post(
        "/users/register",
        json=register_payload,
    )

    assert register_response.status_code == 201

    # Login
    login_response = client.post(
        "/users/login",
        data={
            "username": email,
            "password": "Password123",
        },
    )

    assert login_response.status_code == 200

    data = login_response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_wrong_password(client):
    email = f"wrongpass_{uuid4().hex}@example.com"

    register_payload = {
        "full_name": "Wrong Password User",
        "email": email,
        "password": "Password123",
    }

    # Register the user
    register_response = client.post(
        "/users/register",
        json=register_payload,
    )

    assert register_response.status_code == 201

    # Try logging in with the wrong password
    login_response = client.post(
        "/users/login",
        data={
            "username": email,
            "password": "WrongPassword",
        },
    )

    assert login_response.status_code == 401

    data = login_response.json()

    assert data["error"]["message"] == "Invalid email or password"

def test_get_current_user(client):
    email = f"me_{uuid4().hex}@example.com"

    register_payload = {
        "full_name": "Current User",
        "email": email,
        "password": "Password123",
    }

    # Register
    register_response = client.post(
        "/users/register",
        json=register_payload,
    )

    assert register_response.status_code == 201

    # Login
    login_response = client.post(
        "/users/login",
        data={
            "username": email,
            "password": "Password123",
        },
    )

    assert login_response.status_code == 200

    token = login_response.json()["access_token"]

    # Access protected endpoint
    response = client.get(
        "/users/me",
        headers={
            "Authorization": f"Bearer {token}"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["email"] == email
    assert data["full_name"] == "Current User"