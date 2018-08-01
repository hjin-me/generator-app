const chokidar = require("chokidar");
const path = require("path");
const { spawn, exec } = require("child_process");
const os = require("os");
const { envUpdate } = require("./env");

function debounce(func, wait) {
  let timeout;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func();
    }, wait);
  };
}

let building;
let killing = Promise.resolve();
let kill = () => {};

function autoBuild(...files) {
  let appName = "app";
  if (process.platform === "win32") {
    appName += ".exe";
  }

  console.log("building...");
  let args = ["go", "build"];
  args.push("-o", path.join(os.tmpdir(), appName));
  args.push("-tags", `'development'`);
  args.push(...files);
  building = new Promise((resolve, reject) => {
    let cmd = exec(
      args.join(" "),
      {
        cwd: path.join(__dirname, "../api"),
        env: process.env
      },
      (err, stdout, stderr) => {
        if (err) {
          console.log("building error");
          console.error(err);
          return reject(err);
        }
        process.stdout.write(stdout);
        process.stderr.write(stderr);
        resolve();
      }
    );
  });
}

function restart(app) {
  kill();
  killing.then(() => {
    start(app);
  });
}

function start(app) {
  app = path.join(os.tmpdir(), app);
  killing = new Promise(resolve => {
    console.log("start app");
    let cmd = spawn(app, [], {
      cwd: path.join(__dirname, "../api"),
      env: process.env,
      shell: true,
      stdio: "inherit"
    });
    cmd.on("exit", () => {
      resolve();
    });
    kill = () => {
      console.log("killing ...");
      cmd.kill();
    };
    // cmd.stdout.pipe(process.stdout);
    // cmd.stderr.pipe(process.stderr);
  });
}

const goRun = debounce(
  () => {
    envUpdate();
    autoBuild("app.go");
    building.then(() => {
      restart("app");
    });
  },
  500,
  true
);

// One-liner for current directory, ignores .dotfiles
chokidar
  .watch(["./api/**/*.go", "./*.env"], { ignored: /((^|[\/\\])\..|_test\.go)/ })
  .on("all", (event, path) => {
    goRun();
  });
