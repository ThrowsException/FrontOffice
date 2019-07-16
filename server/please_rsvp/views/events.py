import os
import smtplib
from textwrap import dedent

from aiohttp_security import check_authorized
import aiohttp
from aiohttp import web


async def send_invite(invites):
    reply_url = """<a href="http://localhost:8080/invites/{code}?r=no">
            For No</a><a href="http://localhost:8080/invites/{code}?r=yes">
                For Yes</a>"""

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
            "content": [{"type": "text/html", "value": reply_url}],
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
            content = reply_url.format({"code": invite["code"]})
            port = os.getenv("SMTP_PORT", 0)
            host = os.getenv("SMTP_HOST", "smtp")
            with smtplib.SMTP(host, port=port) as smtp:
                smtp.sendmail("me@me.com", invite["email"], content)

        return 200


class TeamEvents(web.View):
    async def get(self):
        await check_authorized(self.request)
        id = self.request.match_info.get("id")

        sql = "SELECT * FROM events WHERE team = {}".format(id)

        items = []
        async with self.request.app["db_pool"].acquire() as conn:
            async with conn.cursor() as cur:
                await cur.execute(sql)
                result = await cur.fetchall()
                items = [{"id": x[0], "name": x[1], "team": x[2]} for x in result]

        return web.json_response(items)


class EventView(web.View):
    async def get(self):
        await check_authorized(self.request)
        event_id = self.request.match_info.get("id")

        sql = "SELECT * FROM events"
        if event_id:
            sql = "{} WHERE id = {}".format(sql, event_id)

        items = []
        async with self.request.app["db_pool"].acquire() as conn:
            async with conn.cursor() as cur:
                await cur.execute(sql)
                result = await cur.fetchall()
                items = [{"id": x[0], "name": x[1], "team": x[2]} for x in result]

        return web.json_response(items)

    async def post(self):
        needs_invite = []
        async with self.request.app["db_pool"].acquire() as conn:
            async with conn.cursor() as cur:
                body = await self.request.json()
                sql = dedent(
                    """
                    INSERT INTO events (name, team)
                    VALUES ('{}', '{}') RETURNING id
                """.format(
                        body["name"], body["team"]
                    )
                )
                await cur.execute(sql)
                result = await cur.fetchone()

                sql = dedent(
                    """
                    SELECT id, email
                    FROM members
                    WHERE team = '{}'
                """.format(
                        body["team"]
                    )
                )
                await cur.execute(sql)
                members = await cur.fetchall()

                for member in members:
                    sql = dedent(
                        """
                        INSERT INTO invites (event, member, reply)
                        VALUES ('{}', '{}', 'false') RETURNING id
                    """.format(
                            result[0], member[0]
                        )
                    )
                    await cur.execute(sql)
                    invite = await cur.fetchone()

                    needs_invite.append({"email": member[1], "code": invite[0]})

                resp_status = await send_invite(needs_invite)

                return web.json_response(
                    {"id": result[0], "name": body["name"]}, status=resp_status
                )
