from server.views import invite, rsvp


def setup_routes(app):
    app.router.add_get('/{id}', rsvp)
    app.router.add_post('/invite', invite)
