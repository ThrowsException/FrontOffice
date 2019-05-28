# Please RSVP

proof of concept for an idea for RSVP'ing to things via email.
Inspired by a number of things for my hockey teams

- No one wants to download another god damn app. Everyone already has email/text just use that
- Every app sucks. They're either slow, filled with ads, or unintuitive

The idea is an system where you can rsvp with yes or no to an event entirely through a link. No login is required for those who the rsvp is being sent.

## Development

Requires docker and python>=3.7

start an environment

```bash
python -mvenv env
pip install -e server/.
. ./env/bin/activate
pip install -r server/requires/development.txt
```

boostrap docker containers, environment variables and start the app

```bash
. ./startup
python server/please_rsvp/app.py
```

There is currently only two endpoints for the PoC `/invite` and `/invite/{id}`

### POST /invite

request

```json
{
  "team": "Team Name",
  "email": "foo@bar.com"
}
```

response

```json
{ "id": 1 }
```

### GET /invite/{id}

clicking the link marks the invite as accepted

### GET /status

Health check
