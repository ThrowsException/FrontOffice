from please_rsvp.views import invite, rsvp, status


def setup_routes(app):
    app.router.add_get('/status', status)
    app.router.add_post('/invite', invite)
    app.router.add_get('/invite/{id}', rsvp)
