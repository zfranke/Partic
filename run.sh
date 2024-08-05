#!/bin/bash

# Docker-compose down then up
docker-compose down
docker volume rm partic_db-data
./localBuild.sh
docker-compose up -d
docker rmi $(docker images -f "dangling=true" -q)
