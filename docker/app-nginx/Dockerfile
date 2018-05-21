FROM nginx:alpine
LABEL maintainer="HJin_me <hjin.me@gmail.com>"
RUN apk update && apk upgrade && apk add --no-cache ca-certificates
RUN echo "daemon off;" >> /etc/nginx/nginx.conf
COPY ttpl /usr/local/bin/ttpl
COPY start.sh /usr/local/bin/start.sh
CMD ["nginx"]
ENTRYPOINT ["sh", "/usr/local/bin/start.sh"]
EXPOSE 443
EXPOSE 80
