#!/usr/bin/env bash

function handle_template () {
    for tmp in $(find $1 -name "*.tmpl")
    do
        file=${tmp:0:$((${#tmp}-5))}
        echo $file ...replaced
        ttpl -i ${tmp} -o ${file};
    done
}

handle_template "/etc/nginx/conf.d/"
handle_template "/usr/share/nginx/html/"

exec "$@";
