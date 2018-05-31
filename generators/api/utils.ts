import * as Generator from "yeoman-generator";
import chalk from "chalk";
import yosay = require("yosay");

const npmCheck = require("npm-check");
const { name, version } = require("../../package.json");

export function insertBeforeLocation(data: string, insert: string): string {
  const cursor = data.indexOf("location");
  const rest = data.substr(cursor);
  const prefix = data.substr(0, cursor);
  return `${prefix}${insert}${rest}`;
}

type FileDesc = string | string[];

export function overwriteFiles(toOverwrite: FileDesc[], that: Generator) {
  for (const p of toOverwrite) {
    let f: string;
    let t: string;
    if (typeof p !== "string") {
      [f, t] = p;
    } else {
      f = p;
      t = p;
    }
    that.fs.copy(that.templatePath(f), that.destinationPath(t));
  }
}

export function overwriteFilesWithTpl<T>(
  toOverwrite: FileDesc[],
  that: Generator,
  context: T
) {
  for (const p of toOverwrite) {
    let f: string;
    let t: string;
    if (typeof p !== "string") {
      [f, t] = p;
    } else {
      f = p;
      t = p;
    }
    that.fs.copyTpl(that.templatePath(f), that.destinationPath(t), context);
  }
}

export function sortObject(object) {
  const sortedObject = {};
  Object.keys(object)
    .sort()
    .forEach(item => {
      sortedObject[item] = object[item];
    });
  return sortedObject;
}

function getLatestVersion() {
  return npmCheck({ global: true }).then(
    state => state.get("packages").filter(p => p.moduleName === name)[0].latest
  );
}

export async function checkLatest(log) {
  const latest = await getLatestVersion();
  if (version !== latest) {
    log(
      yosay(
        `installed version is ${chalk.yellow(
          version
        )}, but the latest version is ${chalk.green(latest)}
        please use \`${chalk.green(
          `npm i -g @hjin/generator-app`
        )}\` to update!`,
        { maxLength: 100 }
      )
    );
  }
}
