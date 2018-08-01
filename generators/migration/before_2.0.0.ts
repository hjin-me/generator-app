import * as Generator from "yeoman-generator";

export function migration(that: Generator) {
  that.fs.delete(that.destinationPath("./ci/dev"));
  that.fs.delete(that.destinationPath("./ci/default.conf.tmpl"));
}
