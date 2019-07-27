import os
import aiohttp
import smtplib

REPLY_URL = """
    <a href="http://localhost:8080/invites/{code}?r=no">For No</a>
    <a href="http://localhost:8080/invites/{code}?r=yes"> For Yes</a>
    """


async def send_invites(invites):
    if os.getenv("EMAIL_API_KEY", None):

        personalizations = []
        for invite in invites:
            personalizations.append(
                {
                    "to": [{"email": invite["email"]}],
                    "substitutions": {"{code}": str(invite["code"])},
                }
            )
        mail = {
            "personalizations": personalizations,
            "from": {"email": "me@oneillc.io"},
            "content": [{"type": "text/html", "value": REPLY_URL}],
            "subject": "Game Reminder",
        }

        async with aiohttp.ClientSession() as session:
            async with session.post(
                "https://api.sendgrid.com/v3/mail/send",
                headers={
                    "Authorization": "Bearer {}".format(os.getenv("EMAIL_API_KEY")),
                    "Content-Type": "application/json",
                },
                json=mail,
            ) as resp:
                return resp.status

    else:
        for invite in invites:
            content = REPLY_URL.format(code=invite["code"])
            port = os.getenv("SMTP_PORT", 0)
            host = os.getenv("SMTP_HOST", "smtp")
            with smtplib.SMTP(host, port=port) as smtp:
                smtp.sendmail("me@me.com", invite["email"], content)

        return 200
