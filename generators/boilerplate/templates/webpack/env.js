/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
let ENV = process.env.npm_lifecycle_event;
const isTest = ENV === "test";
const isProd = ENV === "build" || ENV === "release";

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const cr = /[A-Z]/g;

function c2s(str) {
  return str.replace(cr, ($0 = "") => {
    return "_" + $0.toLowerCase();
  });
}

function envUpdate() {
  // yo-rc
  const yoRc = require("../.yo-rc.json");
  for (const [key, value] of Object.entries(Object.values(yoRc)[0])) {
    // 项目常量，可以输出到项目源码
    process.env["YO_" + c2s(key).toUpperCase()] = value;
  }

  if (isProd) {
    return;
  }
  // 环境变量仅用于 Go API，Webpack 编译 和 Docker 启动使用。不得在 JS 内使用，故线上环境禁用。
  // 如果需要环境变量注入代码。请参考 passport 使用，利用 docker 修改 index.html 文件，由 JS 运行时动态获取。
  let envFile;
  // Get document, or throw exception on error
  const dcFile = path.join(__dirname, "../docker-compose.yml");
  if (fs.existsSync(dcFile)) {
    try {
      const doc = yaml.safeLoad(
        fs.readFileSync(path.join(__dirname, "../docker-compose.yml"), "utf8")
      );
      envFile = path.join(__dirname, "..", doc.services.dev.env_file);
    } catch (e) {}
  }
  if (!envFile) {
    if (fs.existsSync(path.join(__dirname, "../default.env"))) {
      envFile = path.join(__dirname, "../default.env");
    }
  }
  if (envFile) {
    require("dotenv").config({ path: envFile });
  }
}

envUpdate();
function env(key) {
  return process.env[key] || "";
}

function envDefine() {
  return Object.keys(process.env).reduce((previousValue, currentValue) => {
    previousValue[`process.env.${currentValue}`] = JSON.stringify(
      process.env[currentValue]
    );
    return previousValue;
  }, {});
}

module.exports = {
  env,
  envUpdate,
  envDefine,
  isTest,
  isProd
};
