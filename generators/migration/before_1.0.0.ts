import * as Generator from "yeoman-generator";
import { join } from "path";
const removeReg = /^\s*DOCKER_REPOSITORY=.*$/gim;
export function updateEnvFile(that: Generator, dockerRepository: string) {
  const envFiles = ["prod.env", "pre.env"];
  const oldPath = "./ci/config/";
  const latestPath = "./env";
  for (const env of envFiles) {
    const p = join(oldPath, env);
    const newP = join(latestPath, env);
    if (that.fs.exists(that.destinationPath(p))) {
      let content = that.fs.read(that.destinationPath(p));
      content = content.replace(removeReg, "");
      that.fs.write(that.destinationPath(newP), content);
      that.fs.delete(that.destinationPath(p));
    }

    if (that.fs.exists(that.destinationPath(newP))) {
      let content = that.fs.read(that.destinationPath(newP));
      content = content.replace(removeReg, "");
      that.fs.write(that.destinationPath(newP), content);
    }
  }
}
