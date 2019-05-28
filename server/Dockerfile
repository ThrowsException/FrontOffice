FROM python:3.7-alpine
WORKDIR /tmp
COPY ./server /tmp/server
COPY setup.py /tmp

RUN apk update && apk add postgresql-dev gcc python3-dev musl-dev git curl && \
  pip install -r /tmp/server/requires/install.txt && \
  python setup.py bdist && python setup.py install

ENTRYPOINT ["please-rsvp"]

HEALTHCHECK --interval=10s --timeout=3s \
  CMD curl -f http://localhost:8080/status || exit 1
