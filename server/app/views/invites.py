from aiohttp import web
from aiohttp_cors import CorsViewMixin

from app.utils.send_invite import send_invites
from ..utils.authorize import authorize


class InviteView(web.View, CorsViewMixin):
    async def get(self):
        invite_id = self.request.match_info.get("id")
        response = self.request.query.get("r")

        sql = "SELECT * FROM invites"
        if invite_id:
            sql = f"{sql} WHERE id = %s"

        async with self.request.app["db_pool"].acquire() as conn:
            async with conn.cursor() as cur:
                await cur.execute(sql, (invite_id,))
                result = await cur.fetchall()

                if result:
                    if response == "yes":
                        await cur.execute(
                            "UPDATE invites set reply=%s where id=%s", (True, invite_id)
                        )
                        return web.Response(text="Thanks")
                    else:
                        await cur.execute(
                            "UPDATE invites set reply=%s where id=%s",
                            (False, invite_id),
                        )
                        return web.Response(text="Boo")
                else:
                    return web.Response(text="I didn't find that")

    async def post(self):
        authorize(self.request)
        body = await self.request.json()
        event_id = body["event"]

        async with self.request.app["db_pool"].acquire() as conn:
            async with conn.cursor() as cur:
                sql = """
                    SELECT id, name, date, team, refreshments
                    FROM events
                    WHERE id = %s
                """
                await cur.execute(sql, (event_id,))
                event = await cur.fetchone()

                sql = """
                    SELECT e.id, m.id, m.email, i.id, i.reply
                    FROM events e
                    JOIN members m USING (team)
                    LEFT JOIN invites i ON m.id = i.member
                    WHERE e.id = %s and i.reply is null
                """
                await cur.execute(sql, (event_id,))
                results = await cur.fetchall()

                needs_invite = []
                for record in results:
                    sql = """
                        INSERT INTO invites (event, member)
                        VALUES (%s, %s)
                        ON CONFLICT DO NOTHING
                        RETURNING id
                    """

                    await cur.execute(sql, (record[0], record[1]))
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
