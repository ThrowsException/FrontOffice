from aiohttp_security.abc import AbstractAuthorizationPolicy
from passlib.hash import sha256_crypt


class DBAuthorizationPolicy(AbstractAuthorizationPolicy):
    def __init__(self, db):
        self.db = db

    async def authorized_userid(self, identity):
        sql = "SELECT * FROM users WHERE id = %s and disabled = false"
        async with self.db.acquire() as conn:
            async with conn.cursor() as cur:
                await cur.execute(sql, (identity,))
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
                sql = "SELECT * FROM users WHERE id = %s and disabled = false"
                await cur.execute(sql, (identity,))
                user = await cur.fetchone()
                if user is not None:
                    user_id = user[0]
                    is_superuser = user[3]
                    if is_superuser:
                        return True

                    sql = "SELECT * FROM permissions WHERE user_id = %s"
                    await cur.execute(sql, (user_id,))
                    result = await cur.fetchall()
                    for record in result:
                        if record.perm_name == permission:
                            return True

            return False


async def check_credentials(db, username, password):
    async with db.acquire() as conn:
        async with conn.cursor() as cur:
            sql = "SELECT * FROM users WHERE login = %s and disabled = false"
            await cur.execute(sql, (username,))
            user = await cur.fetchone()
            if user is not None:
                hash = user[2]
                return sha256_crypt.verify(password, hash)
    return False


async def get_user(db, login):
    async with db.acquire() as conn:
        async with conn.cursor() as cur:
            sql = "SELECT * FROM users WHERE login = %s and disabled = false"
            await cur.execute(sql, (login,))
            user = await cur.fetchone()
            return user
