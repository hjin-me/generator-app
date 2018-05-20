/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
let ENV = process.env.npm_lifecycle_event;
const isTest = ENV === "test";
const isProd = ENV === "build" || ENV === "release";
const STATIC_PREFIX = process.env.STATIC_PREFIX
  ? process.env.STATIC_PREFIX
  : "";
const NAMESPACE = process.env.PROJECT_NAME || "";
const DEV_PORT = "8765";
// const UGLIFYJS = process.env.UGLIFYJS === true || ('' + process.env.UGLIFYJS).toLowerCase() === 'true';

const MODULES_DIR = process.env.NODE_DOCKER_MODULES
  ? [__dirname, process.env.NODE_DOCKER_MODULES]
  : [__dirname, "node_modules"];

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

(function() {
  if (isProd) {
    return;
  }

  // Get document, or throw exception on error
  let envFile;
  try {
    const doc = yaml.safeLoad(
      fs.readFileSync(path.join(__dirname, "../docker-compose.yml"), "utf8")
    );
    envFile = path.join(__dirname, "..", doc.services.app.env_file);
  } catch (e) {
    console.error(e);
  }

  let content;

  try {
    content = fs.readFileSync(envFile).toString();
  } catch (e) {}

  if (!content) {
    return;
  }

  content.split("\n").forEach(declaration => {
    declaration = declaration.trim();
    if (!declaration) {
      return;
    }

    if (declaration.length > 1 && declaration.indexOf("=") === -1) {
      console.error("invalid declaration:", declaration);
      return;
    }

    const [key, value] = declaration.split("=");

    process.env[key.trim()] = value.trim();
  });
})();

const allEnv = Object.keys(process.env).reduce(
  (previousValue, currentValue) => {
    previousValue[`process.env.${currentValue}`] = JSON.stringify(
      process.env[currentValue]
    );
    return previousValue;
  },
  {}
);

module.exports = {
  ENV,
  isTest,
  isProd,
  STATIC_PREFIX,
  NAMESPACE,
  DEV_PORT,
  MODULES_DIR,
  //, UGLIFYJS
  allEnv
};
