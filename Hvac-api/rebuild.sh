#!/bin/bash -x
docker rm -f django
docker build -f Dockerfile -t django .
docker run -td --name django django
echo "container IP:"
docker inspect django | grep IPAddress
