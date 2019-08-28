FROM python:3.7-alpine
WORKDIR /tmp

RUN apk update && apk add --no-cache postgresql-dev && \
  apk add --no-cache -t .build-deps gcc python3-dev musl-dev

COPY . /tmp
RUN pip install -r /tmp/requirements.txt && \
  apk del .build-deps

CMD ["python", "app.py"]