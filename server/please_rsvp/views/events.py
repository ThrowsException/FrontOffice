import os
import smtplib
from textwrap import dedent

from aiohttp_security import check_authorized
from aiohttp import web


def send_invite(email, code):
    reply_url = """<a href="http://localhost:8080/invites/{0}?r=no">
        For No</a><a href="http://localhost:8080/invites/{0}?r=yes">
            For Yes</a>""".format(
        code
    )
    content = reply_url
    port = os.getenv("SMTP_PORT", 0)
    host = os.getenv("SMTP_HOST", "smtp")
    with smtplib.SMTP(host, port=port) as smtp:
        smtp.sendmail("me@me.com", email, content)


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

                for record in needs_invite:
                    send_invite(**record)

                return web.json_response({"id": result[0], "name": body["name"]})
