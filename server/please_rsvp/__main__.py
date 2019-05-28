from aiohttp import web

from please_rsvp.app import make_app

web.run_app(make_app())
