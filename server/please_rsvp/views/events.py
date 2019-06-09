from textwrap import dedent

from aiohttp import web


class EventView(web.View):
    async def get(self):
        event_id = self.request.match_info.get('id')

        sql = 'SELECT * FROM events'
        if event_id:
            sql = '{} WHERE id = {}'.format(sql, event_id)

        items = []
        async with self.request.app['db_pool'].acquire() as conn:
            async with conn.cursor() as cur:
                await cur.execute(sql)
                result = await cur.fetchall()
                items = [{
                    'id': x[0],
                    'name': x[1],
                    'team': x[2]
                } for x in result]

        return web.json_response(items)

    async def post(self):
        async with self.request.app['db_pool'].acquire() as conn:
            async with conn.cursor() as cur:
                body = await self.request.json()
                sql = dedent("""
                    INSERT INTO events (name, team)
                    VALUES ('{}', '{}') RETURNING id
                """.format(body['name'], int(body['team'])))
                await cur.execute(sql)
                result = await cur.fetchone()
                return web.json_response({'id': result[0]})
