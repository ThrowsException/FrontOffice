import datetime
from functools import partial
import json
import os
import smtplib
from textwrap import dedent

import arrow
from aiohttp_security import check_authorized
import aiohttp
from aiohttp import web
from please_rsvp.utils.send_invite import send_invites


def myconverter(o):
    if isinstance(o, datetime.datetime):
        return o.__str__()


class TeamEvents(web.View):
    async def get(self):
        await check_authorized(self.request)
        id = self.request.match_info.get("id")

        sql = "SELECT id, name, date, team FROM events WHERE team = {}".format(id)

        items = []
        async with self.request.app["db_pool"].acquire() as conn:
            async with conn.cursor() as cur:
                await cur.execute(sql)
                result = await cur.fetchall()
                items = [
                    {
                        "id": x[0],
                        "name": x[1],
                        "date": arrow.Arrow.fromdatetime(x[2]).format(),
                        "team": x[3],
                    }
                    for x in result
                ]

        return web.json_response(items)


class EventView(web.View):
    async def get(self):
        await check_authorized(self.request)
        event_id = self.request.match_info.get("id")

        sql = """SELECT e.id, e.name, e.date, e.team
        FROM events e
        """
        if event_id:
            sql = "{} where e.id = {}".format(sql, event_id)

        members_sql = """
        SELECT m.id, m.name, m.email, i.id, i.reply from members m 
        LEFT JOIN invites i 
        ON m.id = i.member 
        where team = {}
        """

        event = {}
        async with self.request.app["db_pool"].acquire() as conn:
            async with conn.cursor() as cur:
                await cur.execute(sql)
                result = await cur.fetchone()
                if result:
                    event = {
                        "id": result[0],
                        "name": result[1],
                        "date": arrow.Arrow.fromdatetime(result[2]).format(),
                        "team": result[3],
                        "members": [],
                    }

                    await cur.execute(members_sql.format(result[3]))
                    result = await cur.fetchall()
                    if result:
                        event["members"] = [
                            {
                                "id": x[0],
                                "name": x[1],
                                "email": x[2],
                                "invite_id": x[3],
                                "reply": x[4],
                            }
                            for x in result
                        ]

                # players = [{"player": x[4]} for x in result]
                # event["players"] = players

        return web.json_response(event, dumps=partial(json.dumps, default=myconverter))

    async def post(self):
        needs_invite = []
        async with self.request.app["db_pool"].acquire() as conn:
            async with conn.cursor() as cur:

                body = await self.request.json()
                print(body["date"])
                sql = dedent(
                    """
                    INSERT INTO events (name, date, team)
                    VALUES ('{}', '{}', '{}') RETURNING id
                """.format(
                        body["name"], body["date"], body["team"]
                    )
                )
                await cur.execute(sql)
                result = await cur.fetchone()

                # sql = dedent(
                #     """
                #     SELECT id, email
                #     FROM members
                #     WHERE team = '{}'
                # """.format(
                #         body["team"]
                #     )
                # )
                # await cur.execute(sql)
                # members = await cur.fetchall()

                # for member in members:
                #     sql = dedent(
                #         """
                #         INSERT INTO invites (event, member, reply)
                #         VALUES ('{}', '{}', 'false') RETURNING id
                #     """.format(
                #             result[0], member[0]
                #         )
                #     )
                #     await cur.execute(sql)
                #     invite = await cur.fetchone()

                #     needs_invite.append({"email": member[1], "code": invite[0]})

                # resp_status = await send_invites(needs_invite)
                resp_status = 200
                return web.json_response(
                    {"id": result[0], "name": body["name"], "date": body["date"]},
                    status=resp_status,
                )
