import * as Generator from "yeoman-generator";
import * as mkdirp from "mkdirp";
import { updateCheck } from "../utils";

const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");
const GitUrlParse = require("git-url-parse");
const gitconfig = require("gitconfiglocal");
const semver = require("semver");
const { version } = require("../../package.json");

module.exports = class extends Generator {
  props: {
    git: string;
    projectName: string;
    boilerplate: boolean;
    dockerRepository: string;
  } = {
    git: "",
    projectName: "",
    boilerplate: true,
    dockerRepository: ""
  };
  // yeoman-generator tsd lost this method
  async: () => () => void;

  constructor(args, options) {
    super(args, options);
    this.option("boilerplate", {
      type: Boolean,
      hide: true,
      default: true
    });
  }

  async initializing() {
    const done = this.async();
    updateCheck();
    const v = this.config.get("version");
    if (v && semver.gte(v, "1.0.0")) {
      // 已有项目升级
      this.props.dockerRepository = this.config.get("dockerRepository");
      this.props.projectName = this.config.get("appName");
      this.props.boilerplate = false;
    }

    if (this.fs.exists(this.destinationPath(".git/config"))) {
      await new Promise(resolve => {
        gitconfig("./", (err, config) => {
          if (config && config.remote && config.remote.origin) {
            this.props.git = config.remote.origin.url;
          }
          resolve();
        });
      });
    }
    done();
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the bedazzling ${chalk.green(
          "@hjin/generator-app"
        )} generator! 
        ${chalk.gray("v" + version)}`
      )
    );
    this.fs.readJSON(this.destinationPath());

    const prompts: Generator.Question[] = [
      {
        type: "input",
        name: "git",
        message: "项目仓库地址",
        default: this.props.git,
        validate: input => (!input ? "git repository shouldn't be null!" : true)
      }
    ];
    prompts.push({
      type: "input",
      name: "dockerRepository",
      message: "该项目的 docker repository 完整地址",
      default: this.props.dockerRepository,
      validate: input =>
        !input ? "docker repository shouldn't be null!" : true
    });

    return this.prompt(prompts).then(props => {
      const { git, passport } = props;
      const { name: projectName } = GitUrlParse(git);
      this.props.git = git;
      this.props.projectName = this.props.projectName || projectName;
      this.props.dockerRepository = props.dockerRepository;
    });
  }

  default() {
    if (
      this.props.boilerplate &&
      path.basename(this.destinationPath()) !== this.props.projectName
    ) {
      this.log(
        `Your generator must be inside a folder named ${
          this.props.projectName
        }\nI'll automatically create this folder.`
      );
      mkdirp.sync(this.props.projectName);
      this.destinationRoot(this.destinationPath(this.props.projectName));
    }
    // after destination root, set config
    this.config.set("appName", this.props.projectName);
    this.config.set("version", version);
    this.config.set("dockerRepository", this.props.dockerRepository);
    this.config.save();

    this.composeWith(require.resolve("../boilerplate"), {
      ...this.options,
      ...this.props
    });
    this.composeWith(require.resolve("../tests"), {
      ...this.options,
      ...this.props
    });
  }

  install() {
    this.installDependencies({
      npm: false,
      bower: false,
      yarn: true
    });
  }

  end() {
    this.log("Thanks.");
  }
};
