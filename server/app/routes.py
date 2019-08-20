from aiohttp import web

from app.views import events, invites, members, teams


async def status(request):
    return web.Response(text="Healthy")


def setup_routes(app):
    app.router.add_get("/status", status)
    app.router.add_get("/api/status", status)

    app.router.add_view("/api/teams", teams.TeamView)
    app.router.add_view("/api/teams/{id}", teams.TeamView)
    app.router.add_view("/api/teams/{id}/events", events.TeamEvents)
    app.router.add_view("/api/teams/{id}/members", members.TeamMembers)

    app.router.add_view("/api/events", events.EventView)
    app.router.add_view("/api/events/{id}", events.EventView)

    app.router.add_view("/api/members", members.MemberView)
    app.router.add_view("/api/members/{id}", members.MemberView)

    app.router.add_view("/api/invites", invites.InviteView)
    app.router.add_view("/api/invites/{id}", invites.InviteView)
