import * as Generator from "yeoman-generator";
import {
  overwriteFiles,
  overwriteFilesWithTpl,
  sortObject
} from "../api/utils";
const { version } = require("../../package.json");

interface Options {
  git: string;
  projectName: string;
  dockerRepository: string;
  boilerplate: boolean;
}
module.exports = class extends Generator {
  options: Options;
  constructor(args: string | string[], options: Options) {
    super(args, options);
    this.option("boilerplate", {
      type: Boolean,
      default: true
    });
    this.option("projectName", {
      type: String,
      default: "",
      description: "This project name"
    });
    this.option("dockerRepository", {
      type: String,
      default: "",
      description: "docker repository"
    });
  }
  configuring() {
    const toOverwrite = [
      ".dockerignore",
      ".editorconfig",
      [".gitignore.tpl", ".gitignore"],
      [".npmrc.tpl", ".npmrc"],
      ".stylelintrc",
      "docker-compose.yml",
      "postcss.config.js",
      "tsconfig.json",
      "tslint.json",
      "default.env"
    ];
    overwriteFiles(toOverwrite, this);
  }

  writing() {
    const toCopy = [["webpack/**", "webpack"]];
    const toCopyTpl: Array<string | string[]> = [["ci/**", "ci/"], "README.md"];
    if (this.options.boilerplate) {
      toCopyTpl.push(["env", "env"]);
      toCopyTpl.push(["src/**", "src/"]);
      toCopyTpl.push("package.json");
    } else {
      this._mergePackageJSON();
    }
    overwriteFiles(toCopy, this);
    overwriteFilesWithTpl(toCopyTpl, this, {
      projectName: this.options.projectName,
      dockerRepository: this.options.dockerRepository,
      version
    });
  }
  _mergeEnv() {
    /*
     * TODO
     * should check env files contain
     * `
     *  DOCKER_REPOSITORY=<%= dockerRepository %>
     * `
     */
    // TODO
    // check env contain
  }
  _mergePackageJSON() {
    const dep = ["devDependencies", "scripts", "dependencies", "lint-staged"];
    const raw = this.fs.readJSON(this.templatePath("package.json"));
    const targetPath = this.destinationPath("package.json");
    const target = this.fs.readJSON(targetPath);

    target.scripts = { ...target.scripts, ...raw.scripts };
    target.devDependencies = {
      ...target.devDependencies,
      ...raw.devDependencies
    };
    target.dependencies = { ...target.dependencies, ...raw.dependencies };
    target["lint-staged"] = { ...target["lint-staged"], ...raw["lint-staged"] };
    // Sort key words
    dep.forEach(field => {
      if (target[field]) {
        target[field] = sortObject(target[field]);
      }
    });

    this.fs.writeJSON(targetPath, target);
  }
};
