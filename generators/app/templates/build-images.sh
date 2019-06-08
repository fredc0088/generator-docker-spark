#!/bin/bash

set -e

docker build -t spark-base:2.4.1 ./docker/spark-base
docker build -t spark-master:2.4.1 ./docker/spark-master
docker build -t spark-worker:2.4.1 ./docker/spark-worker
docker build -t spark-submit:2.4.1 ./docker/spark-submit
docker build -t zeppelin:0.8.1 ./docker/zeppelin
