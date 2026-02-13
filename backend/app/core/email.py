import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import EMAIL_USER, EMAIL_PASS


def send_otp_email(to_email: str, otp: str):

    msg = MIMEMultipart()
    msg["From"] = EMAIL_USER
    msg["To"] = to_email
    msg["Subject"] = "Your OTP Code - HireHelper"

    body = f"""
    <h2>Your OTP Code</h2>
    <p>Your verification code is:</p>
    <h1>{otp}</h1>
    <p>This code expires in 5 minutes.</p>
    """

    msg.attach(MIMEText(body, "html"))

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASS)
        server.sendmail(EMAIL_USER, to_email, msg.as_string())
        server.quit()
    except Exception as e:
        print("Email sending failed:", e)
        raise
