from app.services.security import hash_password, verify_password

password = "Hello123"

hashed = hash_password(password)

print("Hashed Password:")
print(hashed)

print()

print("Password Match:")
print(verify_password(password, hashed))