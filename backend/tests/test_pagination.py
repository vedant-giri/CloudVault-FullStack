from io import BytesIO
from uuid import uuid4


def test_file_pagination(client):
    email = f"pagination_{uuid4().hex}@example.com"

    # Register
    client.post(
        "/users/register",
        json={
            "full_name": "Pagination User",
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

    # Upload 15 files
    for i in range(15):
        client.post(
            "/files/upload",
            files={
                "file": (
                    f"file_{i}.txt",
                    BytesIO(f"content {i}".encode()),
                    "text/plain",
                )
            },
            headers={
                "Authorization": f"Bearer {token}"
            },
        )

    # Get first page
    response = client.get(
        "/files",
        params={
            "page": 1,
            "page_size": 10,
        },
        headers={
            "Authorization": f"Bearer {token}"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 10

    # Get second page
    response = client.get(
        "/files",
        params={
            "page": 2,
            "page_size": 10,
        },
        headers={
            "Authorization": f"Bearer {token}"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 5