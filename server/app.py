import os

from aiohttp import web
import aiopg

from server.routes import setup_routes


async def create_aiopg(app):
    app['db_pool'] = await aiopg.create_pool(os.environ['POSTGRES_DNS'])


def make_app():
    app = web.Application()
    app.on_startup.append(create_aiopg)
    setup_routes(app)
    return app


if __name__ == '__main__':
    web.run_app(make_app())
