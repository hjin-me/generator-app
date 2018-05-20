#!/usr/bin/env bash
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
    echo "build"
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

DND="DO_NOT_DELETE"
mkdir ${DND}
mv default.env ${DND}
ls -1A | grep -v ${DND} | xargs rm -rf
cp -rf ${DND}/* . && rm -rf ${DND}

# publish
echo ${TAG} > ./CONTAINER_TAG

# download
docker save ${DOCKER_REPOSITORY}:${TAG} -o ./image.tar

# clean

echo "success"
