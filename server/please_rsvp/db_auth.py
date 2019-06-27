from aiohttp_security.abc import AbstractAuthorizationPolicy
from passlib.hash import sha256_crypt

class DBAuthorizationPolicy(AbstractAuthorizationPolicy):
    def __init__(self, db):
        self.db = db

    async def authorized_userid(self, identity):
        sql = 'SELECT * FROM users WHERE login = {} and disabled = false'.format(identity)
        async with self.db.acquire() as conn:
            async with conn.cursor() as cur:
                await cur.execute(sql)
                result = await cur.fetchall()
                if result:
                    return identity
                else:
                    return None

    async def permits(self, identity, permission, context=None):
        if identity is None:
            return False

        async with self.db.acquire() as conn:
            async with conn.cursor() as cur:
                sql = "SELECT * FROM users WHERE login = '{}' and disabled = false".format(identity)
                await cur.execute(sql)
                user = await cur.fetchone()
                if user is not None:
                    user_id = user[0]
                    is_superuser = user[3]
                    if is_superuser:
                        return True

                    sql = "SELECT * FROM premissions WHERE user_id = '{}'".format(user_id)
                    await cur.execute(sql)
                    result = await cur.fetchall()
                    for record in result:
                        if record.perm_name == permission:
                            return True

            return False


async def check_credentials(db, username, password):
    async with db.acquire() as conn:
        async with conn.cursor() as cur:
            print(username, password)
            sql = "SELECT * FROM users WHERE login = '{}' and disabled = false".format(username)
            await cur.execute(sql)
            user = await cur.fetchone()
            if user is not None:
                hash = user[2]
                print(hash)
                return sha256_crypt.verify(password, hash)
    return False