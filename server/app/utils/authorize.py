import jwt
import json
from aiohttp import web


def authorize(request):
    """
    Check aws jwt
    """
    keys = request.app["cognito_keys"]
    authorization_header = request.headers["Authorization"]
    token = authorization_header.split(" ")[1]

    headers = jwt.get_unverified_header(token)
    kid = headers["kid"]
    # search for the kid in the downloaded public keys
    key_index = -1
    for i in range(len(keys)):
        if kid == keys[i]["kid"]:
            key_index = i
            break
    if key_index == -1:
        print("Public key not found in jwks.json")
        raise web.HTTPUnauthorized()

    # construct the public key
    print(keys[key_index])
    public_key = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(keys[key_index]))
    try:
        decoded = jwt.decode(
            token, public_key, algorithm="RS256", audience="5doe311sg57aocpmnnh773m9vr"
        )
    except jwt.exceptions.PyJWTError:
        raise web.HTTPUnauthorized()

    user_id = decoded["cognito:username"]
    request["user_id"] = user_id
