import * as Generator from "yeoman-generator";
import {
  insertBeforeLocation,
  overwriteFiles,
  overwriteFilesWithTpl,
  sortObject
} from "./utils";
import * as path from "path";
const GitUrlParse = require("git-url-parse");
const gitconfig = require("gitconfiglocal");

module.exports = class extends Generator {
  props = {
    git: "",
    gitRepository: "",
    projectName: ""
  };
  // yeoman-generator tsd lost this method
  async: () => () => void;
  constructor(args, options) {
    super(args, options);
    if (options.git) {
      this._parseGitRepository(options.git);
    }
  }

  initializing() {
    if (
      !this.props.git &&
      this.fs.exists(this.destinationPath(".git/config"))
    ) {
      const done = this.async();
      gitconfig("./", (err, config) => {
        if (config && config.remote && config.remote.origin) {
          this._parseGitRepository(config.remote.origin.url);
        }
        done();
      });
      return;
    }
  }

  writing() {
    overwriteFiles(["webpack/api.js"], this);
    overwriteFilesWithTpl(["ci/release/Dockerfile"], this, this.props);

    this._removeUseless();
    this._mergePackageJSON();
    this._mergeGoCode();
    this._mergeNginxConf();
  }

  _removeUseless() {
    try {
      this.fs.delete(this.destinationPath("docker-compose.yml"));
    } catch {
      // do nothing
    }
    try {
      this.fs.delete(this.destinationPath("ci/default.conf.tmpl"));
    } catch {
      // do nothing
    }
    try {
      this.fs.delete(this.destinationPath("ci/dev"));
    } catch {
      // do nothing
    }
  }

  _mergeNginxConf() {
    (() => {
      const releaseConf = this.fs.read(
        this.destinationPath("ci/default.conf.tmpl")
      );
      if (releaseConf.match(/location\s+\/x\/\s*{/)) {
        return;
      }
      this.fs.write(
        this.destinationPath("ci/default.conf.tmpl"),
        insertBeforeLocation(
          releaseConf,
          `location /x/ {
                proxy_pass  http://127.0.0.1:8787;
        }

        `
        )
      );
    })();

    (() => {
      const devConf = this.fs.read(this.destinationPath("ci/dev/app.conf"));
      if (devConf.match(/location\s+\/x\/\s*{/)) {
        return;
      }
      this.fs.write(
        this.destinationPath("ci/dev/app.conf"),
        insertBeforeLocation(
          devConf,
          `location /x/ {
                proxy_pass  http://dockerhost:8787;
        }

        `
        )
      );
    })();
  }

  _mergeGoCode() {
    if (!this.fs.exists(this.destinationPath("./api/app.go"))) {
      this.fs.copy(this.templatePath("api/**"), this.destinationPath("api"));
    }
  }

  _mergePackageJSON() {
    const dep = ["devDependencies", "scripts"];
    const raw = this.fs.readJSON(this.templatePath("package.json"));
    const targetPath = this.destinationPath("package.json");
    const target = this.fs.readJSON(targetPath);

    target.scripts = { ...target.scripts, ...raw.scripts };
    target.devDependencies = {
      ...target.devDependencies,
      ...raw.devDependencies
    };
    // Sort key words
    dep.forEach(field => {
      if (target[field]) {
        target[field] = sortObject(target[field]);
      }
    });
    this.config.set("api", true);
    this.fs.writeJSON(targetPath, target);
  }

  _parseGitRepository(gitUrl: string) {
    this.props.git = gitUrl;
    const git = GitUrlParse(this.props.git);
    this.props.gitRepository = path.posix.join(
      git.resource,
      git.owner,
      git.name
    );
    this.props.projectName = git.name;
  }
};
