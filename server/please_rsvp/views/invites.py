import os
import smtplib
from textwrap import dedent

from aiohttp import web


class InviteView(web.View):
    def __send_invite(self, email, code):
        content = f'<a href="http://localhost:8080/invite/{code}">Please respond</a>'
        port = os.getenv('SMTP_PORT', 0)
        host = os.getenv('SMTP_HOST', 'smtp')
        with smtplib.SMTP(host, port=port) as smtp:
            smtp.sendmail('me@me.com', email, content)
        return web.Response(text='Thanks')

    async def get(self):
        invite_id = self.request.match_info.get('id')

        sql = 'SELECT * FROM invites'
        if invite_id:
            sql = '{} WHERE id = {}'.format(sql, invite_id)

        async with self.request.app['db_pool'].acquire() as conn:
            async with conn.cursor() as cur:
                await cur.execute(sql)
                result = await cur.fetchall()
        return web.json_response(result)

    async def post(self):
        async with self.request.app['db_pool'].acquire() as conn:
            async with conn.cursor() as cur:
                body = await self.request.json()
                sql = dedent("""
                    INSERT INTO invites (email, event, reply)
                    VALUES ('{}', '{}', 'false') RETURNING id
                """.format(body['email'], int(body['event'])))
                await cur.execute(sql)
                result = await cur.fetchone()
                self.__send_invite(body['email'], result[0])
                return web.json_response({'id': result[0]})
