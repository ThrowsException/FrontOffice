FROM python:3.7-alpine
WORKDIR /tmp
COPY ./server /tmp

RUN apk update && apk add postgresql-dev curl && \
  apk add -t .build-deps gcc python3-dev musl-dev && \
  pip install -r /tmp/requires/install.txt && \
  python setup.py bdist && python setup.py install && \
  apk del .build-deps

ENTRYPOINT ["please-rsvp"]

HEALTHCHECK --interval=10s --timeout=3s \
  CMD curl -f http://localhost:8080/status || exit 1
