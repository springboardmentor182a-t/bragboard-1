import random

def generate_otp():
    return str(random.randint(100000, 999999))

def send_otp_email(email, otp):
    print(f"Sending OTP {otp} to {email}")