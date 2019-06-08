from textwrap import dedent

from aiohttp import web


class EventView(web.View):
    async def post(self):
        async with self.request.app['db_pool'].acquire() as conn:
            async with conn.cursor() as cur:
                body = await self.request.json()
                sql = dedent("""
                    INSERT INTO events (name, \"group\")
                    VALUES ('{}', '{}') RETURNING id
                """.format(body['name'], body['group']))
                await cur.execute(sql)
                result = await cur.fetchone()
                return web.json_response({'id': result[0]})
