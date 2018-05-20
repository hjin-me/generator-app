const path = require("path");
const fs = require("fs");
const envFile = path.join(__dirname, "../default.env");
let srcEnvFile = path.join(__dirname, "../env/");
// 更新 ts 编译规则，不生成 source map
let tsconfig = require(path.join(__dirname, "../tsconfig.json"));
tsconfig.compilerOptions.sourceMap = false;
fs.writeFileSync(
  path.join(__dirname, "../tsconfig.json"),
  JSON.stringify(tsconfig)
);
let env = process.argv[2] || "pre";
srcEnvFile = path.join(srcEnvFile, `./${env}.env`);

// 输出 Docker EnvFile
fs.renameSync(srcEnvFile, envFile);
