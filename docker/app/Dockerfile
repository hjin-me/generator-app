FROM alpine:3.9
LABEL maintainer="HJin_me <hjin.me@gmail.com>"
RUN apk upgrade && apk add --no-cache ca-certificates tzdata && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && date
ENV TZ Asia/Shanghai
ENV LANG zh_CN.UTF-8
ENV LANGUAGE zh_CN.UTF-8
ENV LC_ALL zh_CN.UTF-8
STOPSIGNAL SIGTERM
CMD app
