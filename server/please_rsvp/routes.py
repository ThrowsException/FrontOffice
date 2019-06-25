from aiohttp import web

from please_rsvp.views import events, invites, members, teams


async def status(request):
    return web.Response(text='Healthy')


def setup_routes(app):
    app.router.add_get('/status', status)

    app.router.add_view('/teams', teams.TeamView)
    app.router.add_view('/teams/{id}', teams.TeamView)
    app.router.add_view('/teams/{id}/events', events.TeamEvents)
    app.router.add_view('/teams/{id}/members', members.TeamMembers)

    app.router.add_view('/events', events.EventView)
    app.router.add_view('/events/{id}', events.EventView)

    app.router.add_view('/members', members.MemberView)
    app.router.add_view('/members/{id}', members.MemberView)

    app.router.add_view('/invites', invites.InviteView)
    app.router.add_view('/invites/{id}', invites.InviteView)
