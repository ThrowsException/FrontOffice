import os
import smtplib
from textwrap import dedent

from aiohttp import web


def __send_invite(email, code):
    content = f'<a href="http://localhost:8080/{code}">Please respond</a>'
    port = os.getenv('SMTP_PORT', 0)
    with smtplib.SMTP('localhost', port=port) as smtp:
        smtp.sendmail('me@me.com', email, content)
    return web.Response(text='Thanks')


async def status(request):
    return web.Response(text='Healthy')


async def rsvp(request):
    invite_id = request.match_info.get('id')
    async with request.app['db_pool'].acquire() as conn:
        async with conn.cursor() as cur:
            sql = "UPDATE invites SET reply = 't' WHERE id = {}".format(
                invite_id)
            await cur.execute(sql)
    return web.Response(text='THANKS')


async def invite(request):
    async with request.app['db_pool'].acquire() as conn:
        async with conn.cursor() as cur:
            body = await request.json()
            sql = dedent("""
                INSERT INTO invites (email, team, reply)
                VALUES ('{}', '{}', 'false') RETURNING id
            """.format(body['email'], body['team']))
            await cur.execute(sql)
            result = await cur.fetchone()
            __send_invite(body['email'], result[0])
            return web.json_response({'id': result[0]})
