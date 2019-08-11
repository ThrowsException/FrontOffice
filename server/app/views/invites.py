import os
import smtplib
from textwrap import dedent
from aiohttp_security import check_authorized

from aiohttp import web

from app.utils.send_invite import send_invites


class InviteView(web.View):
    async def get(self):
        await check_authorized(self.request)
        invite_id = self.request.match_info.get("id")
        response = self.request.query.get("r")

        sql = "SELECT * FROM invites"
        if invite_id:
            sql = "{} WHERE id = {}".format(sql, invite_id)

        async with self.request.app["db_pool"].acquire() as conn:
            async with conn.cursor() as cur:
                await cur.execute(sql)
                result = await cur.fetchall()

                if result:
                    if response == "yes":
                        await cur.execute(
                            "UPDATE invites set reply={} where id={}".format(
                                True, invite_id
                            )
                        )
                        return web.Response(text="Thanks")
                    else:
                        await cur.execute(
                            "UPDATE invites set reply={} where id={}".format(
                                False, invite_id
                            )
                        )
                        return web.Response(text="Boo")
                else:
                    return web.Response(text="I didn't find that")

    async def post(self):
        await check_authorized(self.request)
        body = await self.request.json()
        event_id = body["event"]

        async with self.request.app["db_pool"].acquire() as conn:
            async with conn.cursor() as cur:
                sql = dedent(
                    """
                    SELECT *
                    FROM events
                    WHERE id = '{}'
                """.format(
                        event_id
                    )
                )
                await cur.execute(sql)
                event = await cur.fetchone()

                sql = dedent(
                    """
                    SELECT e.id, m.id, m.email, i.id, i.reply
                    FROM events e
                    JOIN members m USING (team)
                    LEFT JOIN invites i ON m.id = i.member 
                    WHERE e.id = '{}' and i.reply is null
                """.format(
                        event_id
                    )
                )
                await cur.execute(sql)
                results = await cur.fetchall()

                needs_invite = []
                for record in results:
                    sql = dedent(
                        """
                        INSERT INTO invites (event, member)
                        VALUES ('{}', '{}') 
                        ON CONFLICT DO NOTHING
                        RETURNING id
                       
                    """.format(
                            record[0], record[1]
                        )
                    )
                    await cur.execute(sql)
                    result = await cur.fetchone()
                    if result:
                        needs_invite.append(
                            {"email": record[2], "code": result[0], "member": record[1]}
                        )
                    else:
                        # doesn't need a new entry but hasn't replied
                        needs_invite.append(
                            {"email": record[2], "code": record[3], "member": record[1]}
                        )

                await send_invites(needs_invite, event)

        return web.json_response({"status": "Invites sent"})
