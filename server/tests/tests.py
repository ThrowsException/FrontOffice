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


async def test_get_invite(cli):
    resp = await cli.post('/groups', json={'name': 'Spitfires'})
    group_resp = await resp.json()

    event = await cli.post('/events',
                           json={
                               'name': 'Game',
                               'group': group_resp['id']
                           })
    event_resp = await event.json()

    invite = await cli.post('/invite',
                            json={
                                'email': 'test@bar.com',
                                'team': 'testteam',
                                'event': event_resp['id']
                            })

    invite_resp = await invite.json()
    resp = await cli.get(f'/invite/{invite_resp["id"]}')
    assert resp.status == 200


async def test_post_invite(cli):
    resp = await cli.post('/groups', json={'name': 'Spitfires'})
    group_resp = await resp.json()

    event = await cli.post('/events',
                           json={
                               'name': 'Game',
                               'group': group_resp['id']
                           })
    event_resp = await event.json()

    invite = await cli.post('/invite',
                            json={
                                'email': 'test@bar.com',
                                'team': 'testteam',
                                'event': event_resp['id']
                            })
    assert invite.status == 200


async def test_post_group(cli):
    resp = await cli.post('/groups', json={'name': 'Spitfires'})
    assert resp.status == 200


async def test_post_event(cli):
    resp = await cli.post('/groups', json={'name': 'Spitfires'})
    group = await resp.json()

    resp = await cli.post('/events',
                          json={
                              'name': 'Game',
                              'group': group['id']
                          })
    assert resp.status == 200
