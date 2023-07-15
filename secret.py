import os
import binascii

def generate_secret_key(length=32):
    # Generate a random string of the specified length
    random_bytes = os.urandom(length)
    secret_key = binascii.hexlify(random_bytes).decode()
    return secret_key