from textwrap import dedent

from aiohttp import web
from aiohttp_security import check_authorized


class TeamMembers(web.View):
    async def get(self):
        await check_authorized(self.request)
        id = self.request.match_info.get("id")

        sql = "SELECT * FROM members WHERE team = {}".format(id)

        items = []
        async with self.request.app["db_pool"].acquire() as conn:
            async with conn.cursor() as cur:
                await cur.execute(sql)
                result = await cur.fetchall()

                items = [{"id": x[0], "name": x[1], "email": x[2]} for x in result]

        return web.json_response(items)


class MemberView(web.View):
    async def get(self):
        await check_authorized(self.request)
        member_id = self.request.match_info.get("id")

        sql = "SELECT * FROM members"
        if member_id:
            sql = "{} WHERE id = {}".format(sql, member_id)

        items = []
        async with self.request.app["db_pool"].acquire() as conn:
            async with conn.cursor() as cur:
                await cur.execute(sql)
                result = await cur.fetchall()

                items = [{"id": x[0], "name": x[1], "email": x[2]} for x in result]

        return web.json_response(items)

    async def post(self):
        await check_authorized(self.request)
        async with self.request.app["db_pool"].acquire() as conn:
            async with conn.cursor() as cur:
                body = await self.request.json()
                sql = dedent(
                    """
                    INSERT INTO members (name, email, phone, team)
                    VALUES ('{}', '{}', '{}', '{}') RETURNING id
                """.format(
                        body["name"], body["email"], body["phone"], body["team"]
                    )
                )
                await cur.execute(sql)
                result = await cur.fetchone()
                return web.json_response({"id": result[0], "name": body["name"]})
