import os

from aiohttp_session import setup as setup_session
from aiohttp_session.redis_storage import RedisStorage
from aiohttp_security import setup as setup_security
from aiohttp_security import SessionIdentityPolicy
from aioredis import create_redis_pool
from aiohttp import web
import aiopg    # type: ignore

from please_rsvp.routes import setup_routes
from please_rsvp.db_auth import DBAuthorizationPolicy


async def create_aiopg(app: web.Application):
    HOST = os.getenv('POSTGRES_HOST', 'db')
    PORT = os.getenv('POSTGRES_PORT', '5432')
    dns = f'postgres://postgres:example@{HOST}:{PORT}?application_name=app'
    db = await aiopg.create_pool(dns)
    app['db_pool'] = db
    setup_security(app,
                   SessionIdentityPolicy(),
                   DBAuthorizationPolicy(db))

async def create_session(app: web.Application):
    HOST = os.getenv('REDIS_HOST', 'db')
    PORT = os.getenv('REDIS_PORT', '5432')
    redis_pool = await create_redis_pool((HOST, PORT))
    setup_session(app, RedisStorage(redis_pool))


def make_app() -> web.Application:
    app = web.Application()
    app.on_startup.append(create_aiopg)
    app.on_startup.append(create_session)
    setup_routes(app)
    
    return app


if __name__ == '__main__':
    web.run_app(make_app())
