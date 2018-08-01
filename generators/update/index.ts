import * as Generator from "yeoman-generator";
import { parseGitRepository, updateCheck } from "../utils";

const GitUrlParse = require("git-url-parse");
const gitconfig = require("gitconfiglocal");
const { version } = require("../../package.json");

module.exports = class extends Generator {
  props: {
    git: string;
    projectName: string;
    dockerRepository: string;
    boilerplate: boolean;
  } = {
    git: "",
    projectName: "",
    dockerRepository: "",
    boilerplate: false
  };
  // yeoman-generator tsd lost this method
  async: () => () => void;

  async initializing() {
    const done = this.async();
    updateCheck();
    this.props.dockerRepository = this.config.get("dockerRepository");
    this.props.projectName = this.config.get("appName");

    await new Promise(resolve => {
      gitconfig(this.destinationPath(""), (err, config) => {
        if (config && config.remote && config.remote.origin) {
          this.props.git = config.remote.origin.url;
          const gitParsed = GitUrlParse(config.remote.origin.url);
          this.props.projectName = this.props.projectName || gitParsed.name;
        }
        resolve();
      });
    });
    done();
  }

  prompting() {
    const prompts: Generator.Questions = [];
    if (!this.props.git) {
      prompts.push({
        type: "input",
        name: "git",
        message: "项目仓库地址",
        default: this.props.git
      });
    }

    if (!this.props.dockerRepository) {
      prompts.push({
        type: "input",
        name: "dockerRepository",
        message: "该项目的 docker repository 完整地址",
        default: ""
      });
    }

    return this.prompt(prompts).then(props => {
      if (prompts.length === 0) {
        return;
      }
      if (!this.props.git) {
        const git: string = props.git;
        const { name } = parseGitRepository(git);
        this.props.git = git;
        this.props.projectName = name;
      }
      if (!this.props.dockerRepository) {
        this.props.dockerRepository = props.dockerRepository;
      }
    });
  }

  default() {
    // after destination root, set config
    this.config.set("appName", this.props.projectName);
    this.config.set("version", version);
    this.config.set("dockerRepository", this.props.dockerRepository);
    this.config.save();
    this.composeWith(require.resolve("../migration"), {
      ...this.props
    });

    this.composeWith(require.resolve("../boilerplate"), {
      ...this.props
    });
    this.composeWith(require.resolve("../tests"), {
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
    this.log("Mission Complete. Thanks.");
  }
};
