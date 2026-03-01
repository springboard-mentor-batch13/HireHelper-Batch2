import smtplib
from email.message import EmailMessage
import os
from dotenv import load_dotenv

load_dotenv("d:/Infosys/hire-helper-auth-ui/HireHelper-Batch2/backend/.env")

EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")

print(f"User: {EMAIL_USER}")

msg = EmailMessage()
msg["Subject"] = "Test Email STARTTLS"
msg["From"] = EMAIL_USER
msg["To"] = "sreesaivikas35@gmail.com"
msg.set_content("This is a test email to verify SMTP configuration.")

try:
    # Try port 587 with STARTTLS instead of 465 SSL
    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASS)
        server.send_message(msg)
    print("✅ Successfully sent test email via port 587.")
except Exception as e:
    print(f"❌ Failed to send email via port 587: {e}")
