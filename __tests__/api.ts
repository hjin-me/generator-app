import * as assert from "assert";
import { insertBeforeLocation } from "../generators/api/utils";

describe("generator-app:api", () => {
  it("merge nginx conf correct", () => {
    const before = `
upstream cluster {
{{range "API" | env | split -}}
    server {{.}};
{{- end}}
}

server {
        listen 8080;
        server_name _;
        root /usr/share/nginx/html;

        proxy_http_version      1.1;
        proxy_set_header        Connection          "";
        proxy_set_header        x-forwarded-for     $proxy_add_x_forwarded_for;
        proxy_set_header        x-request-id        $http_x_request_id;

        location /apps {
                proxy_pass  {{"PROTOCOL" | env}}://cluster;
        }

        location /api {
                proxy_pass  {{"PROTOCOL" | env}}://cluster;
        }

        location /static {
                expires     7d;
        }

        location / {
                expires     -1;
                rewrite     ^.*$ /static/{{"PROJECT_NAME" | env}}/index.html    break;
        }

}
`;
    const after = `
upstream cluster {
{{range "API" | env | split -}}
    server {{.}};
{{- end}}
}

server {
        listen 8080;
        server_name _;
        root /usr/share/nginx/html;

        proxy_http_version      1.1;
        proxy_set_header        Connection          "";
        proxy_set_header        x-forwarded-for     $proxy_add_x_forwarded_for;
        proxy_set_header        x-request-id        $http_x_request_id;

        location /x/ {
                proxy_pass  http://127.0.0.1:8787;
        }

        location /apps {
                proxy_pass  {{"PROTOCOL" | env}}://cluster;
        }

        location /api {
                proxy_pass  {{"PROTOCOL" | env}}://cluster;
        }

        location /static {
                expires     7d;
        }

        location / {
                expires     -1;
                rewrite     ^.*$ /static/{{"PROJECT_NAME" | env}}/index.html    break;
        }

}
`;
    assert.equal(
      insertBeforeLocation(
        before,
        `location /x/ {
                proxy_pass  http://127.0.0.1:8787;
        }

        `
      ),
      after,
      "insert ok"
    );
  });
});
