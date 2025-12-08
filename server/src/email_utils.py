import smtplib
from email.mime.text import MIMEText

def send_email(to_email, subject, body):
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = "noreply@test.com"
    msg["To"] = to_email

    try:
        with smtplib.SMTP("localhost", 1025) as server:
            server.sendmail("noreply@test.com", [to_email], msg.as_string())
    except Exception as e:
        print("Failed to send email:", e)
