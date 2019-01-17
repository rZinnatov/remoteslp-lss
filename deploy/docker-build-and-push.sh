IMAGE_NAME=rzinnatov/remoteml-lss:latest

docker login -u $DOCKER_USER -p $DOCKER_PASSWORD
docker build -f ./../deploy/Dockerfile -t $IMAGE_NAME .
docker push $IMAGE_NAME