import os
import aiohttp
import smtplib


async def send_invites(invites, event):
    if os.getenv("EMAIL_API_KEY", None):
        REPLY_URL = """
            <a href="https://frontoffice.app/api/invites/{code}?r=no">For No</a>
            <a href="https://frontoffice.app/api/invites/{code}?r=yes"> For Yes</a>
            """
        refreshments = ""
        personalizations = []
        for invite in invites:
            if event[4] == invite["member"]:
                refreshments = "YOU ARE BRINGING BEER"
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
        REPLY_URL = """
            {refreshments}
            <a href="http://localhost:8000/api/invites/{code}?r=no">For No</a>
            <a href="http://localhost:8000/api/invites/{code}?r=yes"> For Yes</a>
            """
        for invite in invites:
            refreshments = ""
            if event[4] == invite["member"]:
                refreshments = "YOU ARE BRINGING BEER"
            content = REPLY_URL.format(code=invite["code"], refreshments=refreshments)
            port = os.getenv("SMTP_PORT", 0)
            host = os.getenv("SMTP_HOST", "smtp")
            with smtplib.SMTP(host, port=port) as smtp:
                smtp.sendmail("me@me.com", invite["email"], content)

        return 200
