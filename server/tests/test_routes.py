import pytest

from please_rsvp.app import make_app


@pytest.fixture
def cli(loop, aiohttp_client):
    app = make_app()
    return loop.run_until_complete(aiohttp_client(app))


async def test_get_value(cli):
    resp = await cli.get('/status')
    assert resp.status == 200
    assert await resp.text() == 'Healthy'


async def test_invite(cli):
    resp = await cli.post('/teams', json={'name': 'Spitfires'})
    team_resp = await resp.json()

    member = await cli.post('/members',
                            json={
                                'name': 'John Smith',
                                'email': 'blah@localhost.com',
                                'phone': '2222222222',
                                'team': team_resp['id']
                            })
    member_resp = await member.json()

    event = await cli.post('/events',
                           json={
                               'name': 'Game',
                               'team': team_resp['id']
                           })
    event_resp = await event.json()


    invite = await cli.post('/invites',
                            json={
                                'event': event_resp['id'],
                                'member': member_resp['id']
                            })

    assert invite.status == 200


async def test_post_team(cli):
    resp = await cli.post('/teams', json={'name': 'Spitfires'})
    assert resp.status == 200


async def test_post_event(cli):
    resp = await cli.post('/teams', json={'name': 'Spitfires'})
    group = await resp.json()

    resp = await cli.post('/events',
                          json={
                              'name': 'Game',
                              'team': group['id']
                          })
    assert resp.status == 200
