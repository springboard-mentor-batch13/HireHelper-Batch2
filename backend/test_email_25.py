import smtplib
from email.message import EmailMessage
import os
from dotenv import load_dotenv

load_dotenv("d:/Infosys/hire-helper-auth-ui/HireHelper-Batch2/backend/.env")

EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")

msg = EmailMessage()
msg["Subject"] = "Test Email Port 25"
msg["From"] = EMAIL_USER
msg["To"] = "sreesaivikas35@gmail.com"
msg.set_content("This is a test email to verify SMTP configuration.")

try:
    with smtplib.SMTP("smtp.gmail.com", 25, timeout=5) as server:
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASS)
        server.send_message(msg)
    print("✅ Successfully sent test email via port 25.")
except Exception as e:
    print(f"❌ Failed to send email via port 25: {e}")
