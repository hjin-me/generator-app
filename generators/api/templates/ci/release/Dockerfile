FROM node:8 as builder
ENV PROJECT_NAME <%= projectName %>
WORKDIR /project
COPY . /project/
RUN yarn install && yarn build

FROM golang:alpine as goBuilder
WORKDIR "/go/src/<%= gitRepository %>"
COPY ./api ./api
RUN go build -v -o /go/bin/app ./api/app.go

FROM hjin/app
ENV PROJECT_NAME <%= projectName %>
ENV GIN_MODE release
COPY ci/default.conf.tmpl /etc/nginx/conf.d/default.conf.tmpl
COPY --from=builder /project/dist/static /usr/share/nginx/html/static
COPY --from=goBuilder /go/bin/app /usr/local/bin/app
