import pytest

from server.app import make_app


@pytest.fixture
def cli(loop, aiohttp_client):
    app = make_app()
    return loop.run_until_complete(aiohttp_client(app))


async def test_get_value(cli):
    resp = await cli.get('/')
    assert resp.status == 200
    assert await resp.text() == 'Hello, Anonymous'

#
# async def test_get_invite(cli):
#     resp = await cli.get('/invite')
#     assert resp.status == 200


async def test_post_invite(cli):
    resp = await cli.post(
        '/invite',
        json={'email': 'foo@bar.com', 'team': 'team1'})
    assert resp.status == 200
