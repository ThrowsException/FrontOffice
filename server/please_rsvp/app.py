import os

from aiohttp import web
import aiopg  # type: ignore

from please_rsvp.routes import setup_routes


async def create_aiopg(app):
    HOST = os.getenv('POSTGRES_HOST', 'db')
    PORT = os.getenv('POSTGRES_PORT', '5432')
    dns = f'postgres://postgres:example@{HOST}:{PORT}?application_name=app'
    app['db_pool'] = await aiopg.create_pool(dns)


def make_app() -> web.Application:
    app = web.Application()
    app.on_startup.append(create_aiopg)
    setup_routes(app)
    return app


if __name__ == '__main__':
    web.run_app(make_app())
