from textwrap import dedent

from aiohttp import web
from aiohttp_security import check_authorized, authorized_userid


class TeamView(web.View):
    async def get(self):
        await check_authorized(self.request)
        user_id = await authorized_userid(self.request)
        team_id = self.request.match_info.get("id")

        sql = """
            SELECT t.* 
             FROM teams t 
             JOIN owners o ON t.id = o.team
             WHERE o.owner = {}
        """.format(
            user_id
        )
        if team_id:
            sql = "{} AND t.id = {}".format(sql, team_id)

        items = []
        async with self.request.app["db_pool"].acquire() as conn:
            async with conn.cursor() as cur:
                await cur.execute(sql)
                result = await cur.fetchall()

                items = [{"id": x[0], "name": x[1]} for x in result]

        return web.json_response(items)

    async def post(self):
        await check_authorized(self.request)
        user_id = await authorized_userid(self.request)
        async with self.request.app["db_pool"].acquire() as conn:
            async with conn.cursor() as cur:
                body = await self.request.json()
                sql = dedent(
                    """
                    INSERT INTO teams (name)
                    VALUES ('{}') RETURNING id
                """.format(
                        body["name"]
                    )
                )
                await cur.execute(sql)
                result = await cur.fetchone()

                sql = dedent(
                    """
                    INSERT INTO owners
                    VALUES ('{}', '{}')
                """.format(
                        result[0], user_id
                    )
                )
                await cur.execute(sql)
                return web.json_response({"id": result[0], "name": body["name"]})

    async def delete(self):
        await check_authorized(self.request)
        team_id = self.request.match_info.get("id")

        async with self.request.app["db_pool"].acquire() as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    "DELETE FROM OWNERS WHERE TEAM = '{}'".format(team_id)
                )
                await cur.execute("DELETE FROM MEMBERS WHERE ID = '{}'".format(team_id))
                await cur.execute("DELETE FROM EVENTS WHERE ID = '{}'".format(team_id))
                await cur.execute("DELETE FROM TEAMS WHERE ID = '{}'".format(team_id))
                resp_status = 204
                return web.json_response("", status=resp_status)

