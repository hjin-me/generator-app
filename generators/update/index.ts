import * as Generator from "yeoman-generator";
const GitUrlParse = require("git-url-parse");
const { version } = require("../../package.json");

module.exports = class extends Generator {
  props: {
    git: string;
    projectName: string;
    dockerRepository: string;
    api: boolean | string | undefined;
    boilerplate: boolean;
  } = {
    git: "",
    projectName: "",
    dockerRepository: "",
    api: false,
    boilerplate: false
  };
  // yeoman-generator tsd lost this method
  async: () => () => void;
  initializing() {
    this.props.dockerRepository = this.config.get("dockerRepository");
    this.props.api = this.config.get("api");
    // <= 0.3.0
    const pkg = this.fs.readJSON(this.destinationPath("./package.json"));
    if (pkg && pkg["@hjin/app"]) {
      this.props.api = this.props.api || pkg["@hjin/app"].api;
    }
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
    if (typeof this.props.api !== "boolean") {
      prompts.push({
        type: "confirm",
        name: "api",
        message: "是否使用 Golang 做 API 接口？",
        default: false
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
        const gitParsed = GitUrlParse(git);
        const projectName = gitParsed.name;
        this.props.git = git;
        this.props.projectName = projectName;
      }
      if (typeof this.props.api !== "boolean") {
        const api: boolean = props.api;
        this.props.api = this.props.api || api;
      }
      if (!this.props.dockerRepository) {
        this.props.dockerRepository = props.dockerRepository;
      }
    });
  }

  default() {
    // after destination root, set config
    this.config.set("version", version);
    this.config.set("dockerRepository", this.props.dockerRepository);
    this.config.set("api", this.props.api);
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
    if (this.props.api) {
      this.composeWith(require.resolve("../api"), {
        ...this.props
      });
    }
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
