FROM node:8 as builder
ENV PROJECT_NAME <%= projectName %>
WORKDIR /project
COPY . /project/
RUN yarn install && yarn build

FROM golang:alpine as goBuilder
WORKDIR "/go/src/<%= gitRepository %>"
COPY ./api ./api
RUN go build -v -o /go/bin/app ./api/app.go

# TODO
FROM fe-alpine
ENV PROJECT_NAME <%= projectName %>
ENV GIN_MODE release
COPY --from=builder /project/dist/static /var/www/static
COPY --from=goBuilder /go/bin/app /usr/local/bin/app
EXPOSE 8080
CMD app
