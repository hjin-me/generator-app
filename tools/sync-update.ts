#!/usr/bin/env node
import * as fs from "fs-extra";
import { join, basename } from "path";
import * as glob from "glob";
import { sortObject } from "../generators/utils";

import * as program from "commander";

export async function main() {
  function list(val: string) {
    return val.split(",").map(s => s.trim());
  }

  program
    .version("1.0.0")
    .usage(
      '-g "app,boilerplate,migration,passport,update,tests" --src [your project path]'
    )
    .option(
      "-g, --generator <generators>",
      "Generators that need to update, separate by comma.",
      list
    )
    .option("--src <src>", "the project path that has been updated")
    .parse(process.argv);

  if (!program.src || !program.generator || !program.generator.length) {
    program.outputHelp();
    return;
  }
  console.info("sync start...");

  const nameList = await listAllGenerators(program.generator);
  for (const name of nameList) {
    const fileList = await dirSnapshot(name);
    console.info("sanpshot", name, fileList);
    const pathList = reSnapByRules(fileList);
    for (const p of pathList) {
      if (p.isDir) {
        await syncDir(p.path, program.src, join(name, "./templates"));
      } else {
        await syncFile(p.path, program.src, join(name, "./templates"));
      }
    }
  }
}

function reSnapByRules(
  fileList: string[]
): Array<{
  path: string;
  isDir: boolean;
}> {
  const result = [];
  for (const p of fileList) {
    if (p.indexOf("api/vendor") === 0) {
      // golang vendor overwrite by directory
      result.push({
        path: "api/vendor",
        isDir: true
      });
    } else {
      // others overwrite by file
      result.push({
        path: p,
        isDir: false
      });
    }
  }
  // unique
  return result.reduce(
    (
      prev: Array<{ path: string; isDir: boolean }>,
      curr: { path: string; isDir: boolean }
    ) => {
      if (prev.findIndex(p => p.path === curr.path) === -1) {
        prev.push(curr);
      }
      return prev;
    },
    []
  );
}

export async function listAllGenerators(toUpdate: string[]) {
  const rootPath = join(__dirname, "../generators");
  return fs
    .readdirSync(rootPath)
    .filter(name => {
      return (
        fs.lstatSync(join(rootPath, name)).isDirectory() &&
        toUpdate.indexOf(name) > -1
      );
    })
    .map(name => join(rootPath, name));
}

export async function dirSnapshot(dir: string): Promise<string[]> {
  const root = join(dir, "./templates");
  const pattern = "**";
  const options = {
    cwd: root,
    nodir: true
  };
  return glob.sync(pattern, options);
}

export async function syncDir(path: string, from: string, to: string) {
  const fromPath = join(from, path);
  const toPath = join(to, path);
  fs.copySync(fromPath, toPath);
  console.info("success", path, from, "->", to);
}

export async function syncFile(path: string, from: string, to: string) {
  const baseName = basename(path);
  const fromPath = join(from, path);
  const toPath = join(to, path);
  if (!fs.pathExistsSync(fromPath)) {
    // delete
    if (fs.pathExistsSync(toPath)) {
      fs.unlinkSync(toPath);
    }
    return;
  }

  switch (baseName) {
    case "package.json": {
      // merge
      const fields = [
        "devDependencies",
        "scripts",
        "dependencies",
        "lint-staged"
      ];
      const fP = fs.readJSONSync(fromPath);
      const tP = fs.readJSONSync(toPath);
      for (const field of fields) {
        if (!tP[field]) {
          continue;
        }
        for (const key of Object.keys(tP[field])) {
          if (fP[field] && fP[field][key]) {
            tP[field][key] = fP[field][key];
          }
        }
        // sort
        tP[field] = sortObject(tP[field]);
      }
      fs.writeJSONSync(toPath, tP, { spaces: 2 });
      break;
    }
    default: {
      // console.info("copy", fromPath, "->", toPath);
      fs.copyFileSync(fromPath, toPath);
    }
  }
  console.info("success", path, from, "->", to);
}

main();
