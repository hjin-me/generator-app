import * as Generator from "yeoman-generator";
import { updateEnvFile } from "./before_1.0.0";
import * as mkdirp from "mkdirp";

module.exports = class extends Generator {
  options: {
    dockerRepository: string;
  };
  constructor(args, options) {
    super(args, options);
    this.option("dockerRepository", {
      type: String,
      default: "",
      description: "docker repository"
    });
  }
  prompting() {
    const prompts: Generator.Questions = [];
    if (!this.options.dockerRepository) {
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
      if (!this.options.dockerRepository) {
        this.options.dockerRepository = props.dockerRepository;
      }
    });
  }
  writing() {
    this._before1_0_0();
  }

  /**
   *
   * ci/config -> env
   * env add dockerRepository
   * \[d\]ci/config.js
   * delete pacakge.json/\[@hjin/app\]
   * src/test.spec.ts -> __tests__/test.spec.ts
   * create .yo-rc.json
   * @private
   */
  _before1_0_0() {
    updateEnvFile(this, this.options.dockerRepository);
    if (this.fs.exists(this.destinationPath("./ci/config.js"))) {
      this.fs.delete(this.destinationPath("./ci/config.js"));
    }
    const pkg = this.fs.readJSON(this.destinationPath("package.json"));
    delete pkg["@hjin/app"];
    this.fs.writeJSON(this.destinationPath("./package.json"), pkg);
    if (this.fs.exists(this.destinationPath("./src/test.spec.ts"))) {
      mkdirp.sync(this.destinationPath("./__tests__/"));
      this.fs.move(
        this.destinationPath("./src/test.spec.ts"),
        this.destinationPath(this.destinationPath("./__tests__/test.spec.ts"))
      );
    }
  }
};
