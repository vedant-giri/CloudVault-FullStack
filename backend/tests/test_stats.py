from io import BytesIO
from uuid import uuid4


def test_storage_statistics(client):
    email = f"stats_{uuid4().hex}@example.com"

    # Register
    client.post(
        "/users/register",
        json={
            "full_name": "Stats User",
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
                "first.txt",
                BytesIO(b"12345"),
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
                "second.txt",
                BytesIO(b"1234567890"),
                "text/plain",
            )
        },
        headers={
            "Authorization": f"Bearer {token}"
        },
    )

    # Get storage statistics
    response = client.get(
        "/files/stats",
        headers={
            "Authorization": f"Bearer {token}"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "total_files" in data
    assert "total_storage_bytes" in data
    assert "average_file_size" in data

    assert data["total_files"] == 2
    assert data["total_storage_bytes"] == 15
    assert data["average_file_size"] == 7