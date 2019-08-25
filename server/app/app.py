import json
import logging
import os
import urllib.request

from aiohttp import web
import aiohttp_cors
import aiopg  # type: ignore
import psycopg2

from app.routes import setup_routes

logger = logging.getLogger(__name__)


async def setup_cognito_keys(app):
    keys_url = "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_I1wwaxDmP/.well-known/jwks.json"
    response = urllib.request.urlopen(keys_url)
    keys = json.loads(response.read())["keys"]
    app["cognito_keys"] = keys


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


def make_app() -> web.Application:
    app = web.Application()
    app.on_startup.append(create_aiopg)
    app.on_startup.append(setup_cognito_keys)
    setup_routes(app)

    cors = aiohttp_cors.setup(
        app,
        defaults={
            "https://frontoffice.app": aiohttp_cors.ResourceOptions(
                allow_credentials=True, expose_headers="*", allow_headers="*"
            )
        },
    )
    # Configure CORS on all routes.
    for route in list(app.router.routes()):
        cors.add(route)

    return app


if __name__ == "__main__":
    web.run_app(make_app())
