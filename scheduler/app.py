from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import logging
import os
import smtplib

import psycopg2

import arrow
import requests

from jinja2 import Environment, FileSystemLoader, select_autoescape

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


env = Environment(
    loader=FileSystemLoader(os.path.join(os.path.dirname(__file__), "templates")),
    autoescape=select_autoescape(["html", "xml"]),
)


def send_invites(invites, event):

    if os.getenv("EMAIL_API_KEY", None):
        (content, path, loader) = env.loader.get_source(env, "test.html")
        refreshments = ""
        personalizations = []
        for invite in invites:
            if event[4] == invite["member"]:
                refreshments = "YOU ARE BRINGING BEER"

            date = arrow.get(event[2]).to("US/Eastern").format("YYYY-MM-DD h:mm a")
            personalizations.append(
                {
                    "to": [{"email": invite["email"]}],
                    "substitutions": {
                        "{{ code }}": str(invite["code"]),
                        "{{ event }}": event[1],
                        "{{ date }}": date,
                    },
                }
            )
        mail = {
            "personalizations": personalizations,
            "from": {"email": "me@oneillc.io"},
            "content": [{"type": "text/html", "value": content}],
            "subject": "Game Reminder",
        }

        requests.post(
            "https://api.sendgrid.com/v3/mail/send",
            headers={
                "Authorization": "Bearer {}".format(os.getenv("EMAIL_API_KEY")),
                "Content-Type": "application/json",
            },
            data=mail,
        )
    else:
        port = os.getenv("SMTP_PORT", 0)
        host = os.getenv("SMTP_HOST", "smtp")
        msg = MIMEMultipart("alternative")
        with smtplib.SMTP(host, port=port) as smtp:
            for invite in invites:
                refreshments = ""
                if event[4] == invite["member"]:
                    refreshments = "YOU ARE BRINGING BEER"

                template = env.get_template("test.html")
                content = template.render(
                    date=arrow.get(event[2])
                    .to("US/Eastern")
                    .format("YYYY-MM-DD h:mm a"),
                    event=event[1],
                    code=invite["code"],
                )
                part1 = MIMEText(content, "html")
                msg.attach(part1)
                try:
                    logger.info("Sent reminder to %s" % (invite["email"],))
                    smtp.sendmail("me@me.com", invite["email"], msg.as_string())
                except Exception as e:
                    logger.info("Exception while sending...", exc_info=e)


HOST = os.getenv("POSTGRES_HOST", "db")
PORT = os.getenv("POSTGRES_PORT", "5432")
PASSWORD = os.getenv("POSTGRES_PASSWORD", "example")

# Connect to an existing database
conn = psycopg2.connect(f"host={HOST} port={PORT} password={PASSWORD} user=postgres")

# Open a cursor to perform database operations
cur = conn.cursor()

reminders_sql = """
    select e.id, e.name, e.date, e.team, e.refreshments, r.id
    from reminders r
    join events e on e.id = event
    where sent = false and r.date = DATE 'today'
"""

cur.execute(reminders_sql)
reminders = cur.fetchall()

for reminder in reminders:
    logger.info("Reminder due for %s %s %s" % (reminder[0], reminder[1], reminder[2]))
    sql = """
        SELECT e.id, m.id, m.email, i.id, i.reply
        FROM events e
        JOIN members m USING (team)
        LEFT JOIN invites i ON m.id = i.member
        WHERE e.id = %s and i.reply is null
    """
    cur.execute(sql, (reminder[0],))
    results = cur.fetchall()

    needs_invite = []
    for record in results:
        sql = """
            INSERT INTO invites (event, member)
            VALUES (%s, %s)
            ON CONFLICT DO NOTHING
            RETURNING id
        """

        cur.execute(sql, (record[0], record[1]))
        result = cur.fetchone()
        if result:
            needs_invite.append(
                {"email": record[2], "code": result[0], "member": record[1]}
            )
        else:
            # doesn't need a new entry but hasn't replied
            needs_invite.append(
                {"email": record[2], "code": record[3], "member": record[1]}
            )
    send_invites(needs_invite, reminder)
    logger.info("Reminders sent for %s" % (reminder[0],))

    cur.execute("UPDATE reminders SET sent = true WHERE id = %s", (reminder[5],))
    conn.commit()

# Close communication with the database
cur.close()
conn.close()
