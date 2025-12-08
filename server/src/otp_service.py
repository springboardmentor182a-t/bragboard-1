# server/src/otp_service.py
import random
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from src.entities_otp import OTP
import threading
import smtplib
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv

load_dotenv()

OTP_EXPIRY_MINUTES = int(os.getenv("OTP_EXPIRY_MINUTES", 5))

def generate_otp():
    return f"{random.randint(100000, 999999)}"

def _send_email_smtp(to_email: str, subject: str, body: str):
    try:
        mail_username = os.getenv("MAIL_USERNAME")
        mail_password = os.getenv("MAIL_PASSWORD")
        mail_from = os.getenv("MAIL_FROM", mail_username)
        smtp_server = os.getenv("MAIL_SERVER", "smtp.gmail.com")
        smtp_port = int(os.getenv("MAIL_PORT", 587))

        if not mail_username or not mail_password:
            print("Email credentials not found in .env — skipping email send.")
            return

        msg = MIMEText(body)
        msg["Subject"] = subject
        msg["From"] = mail_from
        msg["To"] = to_email

        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(mail_username, mail_password)
        server.sendmail(mail_from, [to_email], msg.as_string())
        server.quit()
        print(f"OTP sent to {to_email}: {body}")  # log OTP for testing
    except Exception as e:
        print("Error sending OTP email:", e)

def create_and_store_otp(email: str, db: Session):
    code = generate_otp()
    entry = OTP(email=email, code=code)
    db.add(entry)
    db.commit()
    db.refresh(entry)

    # Send email in background thread
    t = threading.Thread(
        target=_send_email_smtp,
        args=(email, "Your BragBoard OTP", f"Your OTP is {code}. It expires in {OTP_EXPIRY_MINUTES} minutes."),
        daemon=True
    )
    t.start()

    return code

def verify_otp(email: str, code: str, db: Session):
    otp = db.query(OTP).filter(OTP.email == email).order_by(OTP.created_at.desc()).first()
    if not otp:
        return False

    now = datetime.now(timezone.utc)
    if otp.created_at < now - timedelta(minutes=OTP_EXPIRY_MINUTES):
        return False

    return otp.code == code
