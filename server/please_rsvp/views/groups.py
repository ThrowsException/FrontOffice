from textwrap import dedent

from aiohttp import web


class GroupView(web.View):
    async def post(self):
        async with self.request.app['db_pool'].acquire() as conn:
            async with conn.cursor() as cur:
                body = await self.request.json()
                sql = dedent("""
                    INSERT INTO groups (name)
                    VALUES ('{}') RETURNING id
                """.format(body['name']))
                await cur.execute(sql)
                result = await cur.fetchone()
                return web.json_response({'id': result[0]})
