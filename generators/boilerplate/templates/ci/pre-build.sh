#!/usr/bin/env bash
source ./default.env
COMMIT_ID=`git rev-parse HEAD`
if git describe --tags --exact-match ${COMMIT_ID}; then
    TAG=`git describe --tags --exact-match ${COMMIT_ID}`
else
    TAG=${COMMIT_ID}
fi

# prepare clean
rm -rf ./dist

# check is built
if docker pull ${DOCKER_REPOSITORY}:${TAG}; then
    echo "exist"
else
    echo "build and publish"
    if docker build -t ${DOCKER_REPOSITORY}:${TAG} -f ./ci/release/Dockerfile . &&
    docker push ${DOCKER_REPOSITORY}; then
        # build success
        echo "build success && upload success"
    else
        # build failed
        echo "build failed"
        exit 1
    fi
fi

echo ${TAG} > ./CONTAINER_TAG

echo "success"
