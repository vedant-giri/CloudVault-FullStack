from app.services.auth import (
    create_access_token,
    verify_access_token,
)

token = create_access_token(
    {
        "sub": "vedant@example.com"
    }
)

print("Generated Token:")
print(token)

payload = verify_access_token(token)

print("\nDecoded Payload:")
print(payload)