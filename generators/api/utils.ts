import * as Generator from "yeoman-generator";
import chalk from "chalk";
import yosay = require("yosay");

const pkg = require("../../package.json");

const updateNotifier = require("update-notifier");
const stringLength = require("string-length");

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

export function updateCheck() {
  const notifier = updateNotifier({
    pkg
  });
  const message = [];

  if (notifier.update) {
    message.push(
      "Update available: " +
        chalk.green.bold(notifier.update.latest) +
        chalk.gray(" (current: " + notifier.update.current + ")")
    );
    message.push(
      "Run " + chalk.magenta("npm install -g " + pkg.name) + " to update."
    );
    console.log(
      yosay(message.join(" "), { maxLength: stringLength(message[0]) })
    );
  }
}
