from aiohttp import web
from aiohttp_security import check_authorized


class TeamMembers(web.View):
    async def get(self):
        await check_authorized(self.request)
        id = self.request.match_info.get("id")

        sql = "SELECT * FROM members WHERE team = %s"

        items = []
        async with self.request.app["db_pool"].acquire() as conn:
            async with conn.cursor() as cur:
                await cur.execute(sql, (id,))
                result = await cur.fetchall()

                items = [{"id": x[0], "name": x[1], "email": x[2]} for x in result]

        return web.json_response(items)


class MemberView(web.View):
    async def get(self):
        await check_authorized(self.request)
        member_id = self.request.match_info.get("id")

        sql = "SELECT * FROM members"
        if member_id:
            sql = f"{sql} WHERE id = %s".format(sql)

        items = []
        async with self.request.app["db_pool"].acquire() as conn:
            async with conn.cursor() as cur:
                await cur.execute(sql, (member_id,))
                result = await cur.fetchall()

                items = [{"id": x[0], "name": x[1], "email": x[2]} for x in result]

        return web.json_response(items)

    async def post(self):
        await check_authorized(self.request)
        async with self.request.app["db_pool"].acquire() as conn:
            async with conn.cursor() as cur:
                body = await self.request.json()
                sql = """
                    INSERT INTO members (name, email, phone, team)
                    VALUES (%s, %s, %s, %s) RETURNING id
                """
                await cur.execute(
                    sql, (body["name"], body["email"], body["phone"], body["team"])
                )
                result = await cur.fetchone()
                return web.json_response({"id": result[0], "name": body["name"]})
