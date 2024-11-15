from cryptography.fernet import Fernet
import base64

# Your generated encryption key
ENCRYPTION_KEY = b'FdRv_cQk2trvddMb9P09p7R5arEQKodPkXhARZ5HpSE='

def encrypt_api_key(api_key):
    f = Fernet(ENCRYPTION_KEY)
    return f.encrypt(api_key.encode()).decode()

def decrypt_api_key(encrypted_api_key):
    f = Fernet(ENCRYPTION_KEY)
    return f.decrypt(encrypted_api_key.encode()).decode()