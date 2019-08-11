from aiohttp import web

from app.app import make_app

web.run_app(make_app())
