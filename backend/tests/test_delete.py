from io import BytesIO
from uuid import uuid4


def test_delete_file(client):
    email = f"delete_{uuid4().hex}@example.com"

    # Register
    client.post(
        "/users/register",
        json={
            "full_name": "Delete User",
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

    # Upload file
    upload_response = client.post(
        "/files/upload",
        files={
            "file": (
                "delete.txt",
                BytesIO(b"Delete me!"),
                "text/plain",
            )
        },
        headers={
            "Authorization": f"Bearer {token}"
        },
    )

    assert upload_response.status_code == 201

    file_id = upload_response.json()["id"]

    # Delete file
    response = client.delete(
        f"/files/{file_id}",
        headers={
            "Authorization": f"Bearer {token}"
        },
    )

    assert response.status_code == 200

    # Verify file no longer exists
    response = client.get(
        f"/files/{file_id}/download",
        headers={
            "Authorization": f"Bearer {token}"
        },
    )

    assert response.status_code == 404