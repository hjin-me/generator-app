FROM nginx:alpine
LABEL maintainer="HJin_me <hjin.me@gmail.com>"
RUN echo "daemon off;" >> /etc/nginx/nginx.conf
COPY ttpl /usr/local/bin/ttpl
COPY multi.sh /usr/local/bin/multi.sh
CMD ["nginx"]
ENTRYPOINT ["sh", "/usr/local/bin/multi.sh"]
EXPOSE 443
EXPOSE 80

