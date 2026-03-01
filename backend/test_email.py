import smtplib
from email.message import EmailMessage
import os
from dotenv import load_dotenv

load_dotenv("d:/Infosys/hire-helper-auth-ui/HireHelper-Batch2/backend/.env")

EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")

print(f"User: {EMAIL_USER}")
print(f"Pass: {'*' * len(EMAIL_PASS) if EMAIL_PASS else 'None'}")

msg = EmailMessage()
msg["Subject"] = "Test Email"
msg["From"] = EMAIL_USER
msg["To"] = "sreesaivikas35@gmail.com" # the user's email from screenshot
msg.set_content("This is a test email to verify SMTP configuration.")

try:
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(EMAIL_USER, EMAIL_PASS)
        server.send_message(msg)
    print("✅ Successfully sent test email.")
except Exception as e:
    print(f"❌ Failed to send email: {e}")
