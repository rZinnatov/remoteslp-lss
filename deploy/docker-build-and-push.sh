IMAGE_NAME=rzinnatov/remoteml-lss:latest

cp ../deploy/Dockerfile Dockerfile
cp ../deploy/.dockerignore .dockerignore

docker login -u $DOCKER_USER -p $DOCKER_PASSWORD
docker build -t $IMAGE_NAME .
docker push $IMAGE_NAME