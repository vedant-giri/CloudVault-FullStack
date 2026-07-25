from io import BytesIO
from uuid import uuid4


def test_search_files(client):
    email = f"search_{uuid4().hex}@example.com"

    # Register
    client.post(
        "/users/register",
        json={
            "full_name": "Search User",
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

    # Upload first file
    client.post(
        "/files/upload",
        files={
            "file": (
                "notes.txt",
                BytesIO(b"My notes"),
                "text/plain",
            )
        },
        headers={
            "Authorization": f"Bearer {token}"
        },
    )

    # Upload second file
    client.post(
        "/files/upload",
        files={
            "file": (
                "photo.jpg",
                BytesIO(b"fake image"),
                "image/jpeg",
            )
        },
        headers={
            "Authorization": f"Bearer {token}"
        },
    )

    response = client.get(
        "/files",
        params={"search": "notes"},
        headers={
            "Authorization": f"Bearer {token}"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) >= 1
    assert any(file["filename"] == "notes.txt" for file in data)