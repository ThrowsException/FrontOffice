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

### POST /teams

request

```json
{
  "name": "Team Name"
}
```

### POST /events

request

```json
{
  "name": "Event Name",
  "team": "<team_id>"
}
```

### POST /members

request

```json
{
  "name": "John Smith",
  "email": "foo@localhost.com",
  "phone": "2222222222",
  "team": "<team_id>"
}
```

### POST /invite

request

```json
{
  "team": "<team_id>",
  "event": "<event_id>",
  "member": "<member_id>"
}
```

### GET /invite/{id}

clicking the link marks the invite as accepted

### GET /status

Health check
