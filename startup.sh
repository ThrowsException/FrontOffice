#!/bin/bash

get_docker_port () {
  echo $(docker-compose port $1 $2 | cut -d: -f2)
}

docker-compose down --remove-orphans
docker-compose pull --ignore-pull-failures
docker-compose up -d db adminer smtp

export POSTGRES_HOST=localhost
export POSTGRES_PORT=$(get_docker_port db 5432)
export SMTP_PORT=$(get_docker_port smtp 1025)

if [ "$1" = "service" ]; then
  docker-compose up -d service
fi
