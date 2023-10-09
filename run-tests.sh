#!/bin/bash

# Stop and remove containers and volumes defined in docker-compose.yml
docker-compose down -v
docker-compose down --remove-orphans
docker-compose build
cd mysql
docker build .
cd ..

# Wait for services to start 
sleep 5

docker-compose up -d

sleep 5


docker-compose run -e PORT=8891 app npm run test 

