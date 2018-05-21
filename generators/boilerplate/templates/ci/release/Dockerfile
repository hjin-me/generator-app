FROM node:8 as builder
ENV PROJECT_NAME <%= projectName %>
WORKDIR /project
COPY . /project/
RUN yarn install && yarn build

FROM hjin/app-nginx
ENV PROJECT_NAME <%= projectName %>
COPY ci/default.conf.tmpl /etc/nginx/conf.d/default.conf.tmpl
COPY --from=builder /project/dist/static /usr/share/nginx/html/static
