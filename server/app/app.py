from concurrent.futures import TimeoutError
import logging
import os

from aiohttp_session import setup as setup_session
from aiohttp_session.redis_storage import RedisStorage
from aiohttp_security import setup as setup_security
from aiohttp_security import SessionIdentityPolicy
from aioredis import create_redis_pool, RedisError
from aiohttp import web
import aiopg  # type: ignore
import psycopg2

from app.routes import setup_routes
from app.db_auth import DBAuthorizationPolicy

logger = logging.getLogger(__name__)


async def create_aiopg(app: web.Application):
    HOST = os.getenv("POSTGRES_HOST", "db")
    PORT = os.getenv("POSTGRES_PORT", "5432")
    PASSWORD = os.getenv("POSTGRES_PASSWORD", "example")
    db = None
    try:
        db = await aiopg.create_pool(
            user="postgres", password=PASSWORD, host=HOST, port=PORT, timeout=5
        )
    except psycopg2.Error as e:
        logger.error(e)
    app["db_pool"] = db
    setup_security(app, SessionIdentityPolicy(), DBAuthorizationPolicy(db))


async def create_session(app: web.Application):
    HOST = os.getenv("REDIS_HOST", "redis")
    PORT = os.getenv("REDIS_PORT", "6379")
    try:
        redis_pool = await create_redis_pool((HOST, PORT), timeout=5)
        setup_session(app, RedisStorage(redis_pool))
    except (RedisError, TimeoutError) as e:
        logger.error(e)


def make_app() -> web.Application:
    app = web.Application()
    app.on_startup.append(create_aiopg)
    app.on_startup.append(create_session)
    setup_routes(app)

    return app


if __name__ == "__main__":
    web.run_app(make_app())
