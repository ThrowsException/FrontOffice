docker-compose up -d

get_docker_port () {
  echo $(docker-compose port $1 $2 | cut -d: -f2)
}

export POSTGRES_DNS=postgres://postgres:example@localhost:$(get_docker_port db 5432)?application_name=bench
export SMTP_PORT=$(get_docker_port smtp 1025)
