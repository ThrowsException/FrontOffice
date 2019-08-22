FROM python:3.7-alpine
WORKDIR /tmp

RUN apk update && apk add --no-cache postgresql-dev && \
  apk add --no-cache -t .build-deps gcc python3-dev musl-dev libffi-dev

COPY . /tmp
RUN pip install -r /tmp/requires/install.txt && \
  python setup.py bdist && python setup.py install && \
  apk del .build-deps

ENTRYPOINT ["front-office"]

HEALTHCHECK --interval=10s --timeout=3s \
  CMD python /tmp/healthcheck.py
