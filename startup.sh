#!/bin/bash

get_docker_port () {
  echo $(docker-compose port $1 $2 | cut -d: -f2)
}

be_healthy () {
  while [ "`docker inspect -f {{.State.Health.Status}} $1`" != 'healthy' ]; do
    echo "`docker inspect $1 -f {{.State.Health.Status}}`"
    sleep 2
  done;
  echo "`docker inspect $1 -f {{.State.Health.Status}}`"
}

mkdir build

docker-compose down --remove-orphans
docker-compose pull --ignore-pull-failures
docker-compose up -d db adminer smtp redis

echo "Waiting for db"
be_healthy $(docker-compose ps -q db)


if [ "$1" = "service" ]; then
  docker-compose up -d --build service
fi

cat << EOF > ./build/test_env
  export POSTGRES_HOST=localhost
  export POSTGRES_PORT=$(get_docker_port db 5432)
  export SMTP_HOST=localhost
  export SMTP_PORT=$(get_docker_port smtp 1025)
  export REDIS_HOST=localhost
  export REDIS_PORT=$(get_docker_port redis 6379)
EOF
