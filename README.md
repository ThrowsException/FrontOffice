# Front Office

Manage team invites through text and email

## Development

### Server

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
./startup && source ./build/test_env
adev runserver --app-factory make_app server/app/app.py
```

### Client

node 12+

```bash
cd client
npm i
npm start
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

## Sends invites for that event to members of the group

request

```json
{
  "event": "<event_id>"
}
```

### GET /invite/{id}

clicking the link marks the invite as accepted

### GET /status

Health check
