import datetime
from functools import partial
import json

from aiohttp import web
from aiohttp_cors import CorsViewMixin
import arrow

from ..utils.authorize import authorize


def myconverter(o):
    if isinstance(o, datetime.datetime):
        return o.__str__()


class TeamEvents(web.View, CorsViewMixin):
    async def get(self):
        authorize(self.request)
        team_id = self.request.match_info.get("id")

        sql = "SELECT id, name, date, team FROM events WHERE team = %s"

        members_sql = """
            SELECT m.id, m.name, m.email, i.id, i.reply, e.id from members m
            LEFT JOIN events e
            ON m.team = e.team
            LEFT JOIN invites i
            ON e.id = i.event
            AND i.member = m.id
            where e.id = %s
            and e.team = %s
        """

        items = []
        async with self.request.app["db_pool"].cursor() as cur:
            await cur.execute(sql, (team_id))
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

            for event in items:
                await cur.execute(members_sql, (event["id"], team_id))
                result = await cur.fetchall()
                if result:
                    event["replies"] = [
                        {
                            "id": x[0],
                            "name": x[1],
                            "email": x[2],
                            "invite_id": x[3],
                            "reply": x[4],
                            "event": x[5],
                        }
                        for x in result
                    ]

        return web.json_response(items)


class EventView(web.View, CorsViewMixin):
    async def get(self):
        authorize(self.request)
        event_id = self.request.match_info.get("id")

        sql = """SELECT e.id, e.name, e.date, e.team, e.refreshments
        FROM events e
        """
        if event_id:
            sql = "{} where e.id = %s".format(sql)

        members_sql = """
            SELECT m.id, m.name, m.email, i.id, i.reply from members m
            LEFT JOIN invites i
            ON m.id = i.member
            where i.event = %s
        """

        members_sql = """
            SELECT m.id, m.name, m.email, i.id, i.reply, e.id from members m
            LEFT JOIN events e
            ON m.team = e.team
            LEFT JOIN invites i
            ON e.id = i.event
            AND i.member = m.id
            where e.id = %s
            and e.team = %s
        """

        event = {}
        async with self.request.app["db_pool"].acquire() as conn:
            async with conn.cursor() as cur:
                await cur.execute(sql, (event_id,))
                result = await cur.fetchone()
                if result:
                    event = {
                        "id": result[0],
                        "name": result[1],
                        "date": arrow.Arrow.fromdatetime(result[2]).format(),
                        "team": result[3],
                        "refreshments": result[4],
                        "members": [],
                    }

                    await cur.execute(members_sql, (event_id, result[3]))
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
        async with self.request.app["db_pool"].acquire() as conn:
            async with conn.cursor() as cur:
                body = await self.request.json()
                sql = """
                    INSERT INTO events (name, date, team, refreshments)
                    VALUES (%s, %s, %s, %s) RETURNING id
                """
                await cur.execute(
                    sql,
                    (body["name"], body["date"], body["team"], body["refreshments"]),
                )
                result = await cur.fetchone()

                game_day_sql = """
                    INSERT INTO reminders (event, date, sent)
                    VALUES (%s, DATE(%s), %s) RETURNING id
                """
                await cur.execute(game_day_sql, (result[0], body["date"], False))

                reminder_sql = """
                    INSERT INTO reminders (event, date, sent)
                    VALUES (%s, DATE(%s) - interval '%s days', %s) RETURNING id
                """
                await cur.execute(
                    reminder_sql, (result[0], body["date"], body["reminder"], False)
                )

                # sql =
                #     """
                #     SELECT id, email
                #     FROM members
                #     WHERE team = '{}'
                # """.format(
                #         body["team"]
                #     )
                # await cur.execute(sql)
                # members = await cur.fetchall()

                # for member in members:
                #     sql =
                #         """
                #         INSERT INTO invites (event, member, reply)
                #         VALUES ('{}', '{}', 'false') RETURNING id
                #     """.format(
                #             result[0], member[0]
                #         )
                #     await cur.execute(sql)
                #     invite = await cur.fetchone()

                #     needs_invite.append({"email": member[1], "code": invite[0]})

                # resp_status = await send_invites(needs_invite)
                resp_status = 200
                return web.json_response(
                    {
                        "id": result[0],
                        "name": body["name"],
                        "date": body["date"],
                        "team": body["team"],
                    },
                    status=resp_status,
                )
