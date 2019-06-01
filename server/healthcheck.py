import sys
from urllib.request import Request, urlopen


req = Request(url='http://localhost:8080/status')
with urlopen(req) as f:
    status = f.status  # type: ignore
    if status != 200:
        sys.exit(1)
