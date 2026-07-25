from io import BytesIO
from uuid import uuid4


def test_upload_file(client):
    email = f"upload_{uuid4().hex}@example.com"

    # Register user
    client.post(
        "/users/register",
        json={
            "full_name": "Upload User",
            "email": email,
            "password": "Password123",
        },
    )

    # Login
    login_response = client.post(
        "/users/login",
        data={
            "username": email,
            "password": "Password123",
        },
    )

    token = login_response.json()["access_token"]

    file = BytesIO(b"Hello CloudVault!")

    response = client.post(
        "/files/upload",
        files={
            "file": ("hello.txt", file, "text/plain")
        },
        headers={
            "Authorization": f"Bearer {token}"
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["filename"] == "hello.txt"
    assert data["content_type"] == "text/plain"
    assert data["size"] > 0