from app.services.auth import create_access_token

token = create_access_token(
    {
        "sub": "vedant@example.com"
    }
)

print(token)