#!/bin/bash

get_docker_port () {
  echo $(docker-compose port $1 $2 | cut -d: -f2)
}

mkdir build

docker-compose down --remove-orphans
docker-compose pull --ignore-pull-failures
docker-compose up -d db adminer smtp

if [ "$1" = "service" ]; then
  docker-compose up -d --build service
fi

cat << EOF > ./build/test_env
  export POSTGRES_HOST=localhost
  export POSTGRES_PORT=$(get_docker_port db 5432)
  export SMTP_HOST=localhost
  export SMTP_PORT=$(get_docker_port smtp 1025)
EOF
