from textwrap import dedent

from aiohttp import web


class GroupView(web.View):
    async def get(self):
        id = self.request.match_info.get('id')

        sql = 'SELECT * FROM groups'
        if id:
            sql = '{} WHERE id = {}'.format(sql, id)

        items = []
        async with self.request.app['db_pool'].acquire() as conn:
            async with conn.cursor() as cur:
                await cur.execute(sql)
                result = await cur.fetchall()

                items = [dict(id=x[0], name=x[1]) for x in result]

        return web.json_response(items)

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
                return web.json_response({'id': result[0], "name": body["name"]})
