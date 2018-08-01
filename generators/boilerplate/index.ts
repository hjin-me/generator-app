import * as Generator from "yeoman-generator";
import {
  mergePackageJSON,
  overwriteFiles,
  overwriteFilesWithTpl,
  parseGitRepository
} from "../utils";

const { version } = require("../../package.json");

interface Options {
  git: string;
  projectName: string;
  dockerRepository: string;
  boilerplate: boolean;
}

module.exports = class extends Generator {
  options: Options;
  props = {
    gitRepository: ""
  };

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

  initializing() {
    if (!this.options.git) {
      throw new Error("generator missing params [git]");
    }
    if (!this.options.projectName) {
      throw new Error("generator missing params [projectName]");
    }
    this._parseGitRepository(this.options.git);
    return;
  }

  configuring() {
    const toOverwrite = [
      ["_dockerignore", ".dockerignore"],
      ["_editorconfig", ".editorconfig"],
      ["_npmignore", ".npmignore"],
      ["_gitignore", ".gitignore"],
      ["_npmrc", ".npmrc"],
      ["_stylelintrc", ".stylelintrc"],
      "docker-compose.yml",
      "postcss.config.js",
      "tsconfig.json",
      "tslint.json",
      "default.env",
      "graphql.config.json"
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
    this._mergeGoCode();
    overwriteFiles(toCopy, this);
    overwriteFilesWithTpl(toCopyTpl, this, {
      projectName: this.options.projectName,
      dockerRepository: this.options.dockerRepository,
      version,
      ...this.props
    });
  }

  _mergeGoCode() {
    if (!this.fs.exists(this.destinationPath("./api/app.go"))) {
      this.fs.copy(this.templatePath("api/**"), this.destinationPath("api"));
    }
  }

  _mergePackageJSON() {
    const dep = ["devDependencies", "scripts", "dependencies", "lint-staged"];
    mergePackageJSON(dep, this);
  }

  _parseGitRepository(gitUrl: string) {
    const { gitRepository } = parseGitRepository(gitUrl);
    this.props.gitRepository = gitRepository;
  }
};
