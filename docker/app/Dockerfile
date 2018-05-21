FROM alpine:3.7
LABEL maintainer="HJin_me <hjin.me@gmail.com>"
RUN apk upgrade && apk add --no-cache ca-certificates
STOPSIGNAL SIGTERM
EXPOSE 443
EXPOSE 80
CMD app
