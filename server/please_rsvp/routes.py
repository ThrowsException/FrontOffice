from aiohttp import web

from please_rsvp.views import events, groups, invites


async def status(request):
    return web.Response(text='Healthy')


def setup_routes(app):
    app.router.add_get('/status', status)

    app.router.add_view('/groups', groups.GroupView)
    app.router.add_view('/groups/{id}', groups.GroupView)

    app.router.add_view('/events', events.EventView)
    app.router.add_view('/events/{id}', events.EventView)

    app.router.add_view('/invite', invites.InviteView)
    app.router.add_view('/invite/{id}', invites.InviteView)
