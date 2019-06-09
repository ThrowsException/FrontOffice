import os
import smtplib
from textwrap import dedent

from aiohttp import web


class InviteView(web.View):
    def __send_invite(self, email, code):
        reply_url = """<a href="http://localhost:8080/invites/{}">
            Please respond</a>""".format(code)
        content = reply_url
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

        body = await self.request.json()
        event_id = body['event']

        async with self.request.app['db_pool'].acquire() as conn:
            async with conn.cursor() as cur:
                sql = dedent("""
                    SELECT e.id, m.id, m.email
                    FROM events e
                    JOIN members m USING (team)
                    WHERE e.id = '{}'
                """.format(event_id))
                await cur.execute(sql)
                results = await cur.fetchall()

                needs_invite = []
                for record in results:
                    sql = dedent("""
                        INSERT INTO invites (event, member, reply)
                        VALUES ('{}', '{}', 'false') RETURNING id
                    """.format(record[0], record[1]))
                    await cur.execute(sql)
                    result = await cur.fetchone()

                    needs_invite.append({'email': record[2], 'code': result[0]})

                for record in needs_invite:
                    self.__send_invite(**record)

        return web.json_response({'status': 'Invites sent'})
