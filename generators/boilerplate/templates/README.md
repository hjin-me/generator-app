

## Build
```
node ./ci/env.js
sh ./ci/pre-build.sh
```

## Deploy
```
docker kill <%= projectName %> > /dev/null 2>&1 || true
docker rm <%= projectName %> > /dev/null 2>&1 || true
cd {WORKSPACE} 
docker load -i image.tar 
cat CONTAINER_TAG | xargs -n 1 -I { docker run -d --name <%= projectName %> -p 8006:8080 --env-file ./default.env --restart=unless-stopped <%= dockerRepository %>:{
```
