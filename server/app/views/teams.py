from aiohttp import web

from ..utils.authorize import authorize


class TeamView(web.View):
    async def get(self):
        authorize(self.request)
        user_id = self.request["user_id"]
        team_id = self.request.match_info.get("id")

        sql = """
            SELECT t.*
             FROM teams t
             JOIN owners o ON t.id = o.team
             WHERE o.owner = %s
        """
        clause = (user_id,)
        if team_id:
            sql = f"{sql} AND t.id = %s".format(sql)
            clause = (user_id, team_id)

        items = []
        async with self.request.app["db_pool"].acquire() as conn:
            async with conn.cursor() as cur:
                await cur.execute(sql, clause)
                result = await cur.fetchall()

                items = [{"id": x[0], "name": x[1]} for x in result]

        return web.json_response(items)

    async def post(self):
        authorize(self.request)
        user_id = self.request["user_id"]
        team_id = self.request.match_info.get("id")
        async with self.request.app["db_pool"].acquire() as conn:
            async with conn.cursor() as cur:
                body = await self.request.json()
                sql = """
                    INSERT INTO teams (name)
                    VALUES (%s) RETURNING id
                """
                await cur.execute(sql, (body["name"],))
                result = await cur.fetchone()

                sql = """
                    INSERT INTO owners
                    VALUES (%s, %s)
                """
                await cur.execute(sql, (result[0], user_id))
                return web.json_response({"id": result[0], "name": body["name"]})

    async def delete(self):
        authorize(self.request)
        user_id = self.request["user_id"]
        team_id = self.request.match_info.get("id")

        async with self.request.app["db_pool"].acquire() as conn:
            async with conn.cursor() as cur:
                await cur.execute("DELETE FROM OWNERS WHERE TEAM = %s", (team_id,))
                await cur.execute("DELETE FROM MEMBERS WHERE ID = %s", (team_id,))
                await cur.execute("DELETE FROM EVENTS WHERE ID = %s", (team_id,))
                await cur.execute("DELETE FROM TEAMS WHERE ID = %s", (team_id,))
                resp_status = 204
                return web.json_response("", status=resp_status)
