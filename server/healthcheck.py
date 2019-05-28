import sys, errno
from urllib.request import urlopen, Request


req = Request(url='http://localhost:8080/status')
with urlopen(req) as f:
    status = f.status
    if status != 200:
        sys.exit(1)
