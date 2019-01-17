IMAGE_NAME=rzinnatov/remoteml-lss:latest
DOCKERFILE_PATH="$(cd "$(dirname "$0")"; pwd)"/Dockerfile

docker login -u $DOCKER_USER -p $DOCKER_PASSWORD
docker build -f DOCKERFILE_PATH -t $IMAGE_NAME .
docker push $IMAGE_NAME