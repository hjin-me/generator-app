import * as Generator from "yeoman-generator";
import { overwriteFiles, sortObject } from "../api/utils";

module.exports = class extends Generator {
  options: {
    boilerplate: boolean;
  };
  constructor(args, options) {
    super(args, options);
    this.option("boilerplate", {
      type: Boolean,
      default: true
    });
  }
  writing() {
    const overwrite = ["__tests__/test.spec.ts", "karma.conf.js"];
    if (this.options.boilerplate) {
      overwrite.push("__tests__/app.spec.tsx");
    }
    overwriteFiles(overwrite, this);
    this._mergePackageJSON();
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

    this.fs.writeJSON(targetPath, target);
  }
};
