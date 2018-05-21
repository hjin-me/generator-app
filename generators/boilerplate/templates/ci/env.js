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

// 获取 conf
const yo = require(path.join(__dirname, "../.yo-rc.json"));
let dockerRepository = "";
for (let k of Object.keys(yo)) {
  if (yo[k] && yo[k].dockerRepository) {
    dockerRepository = yo[k].dockerRepository;
    break;
  }
}
if (!dockerRepository) {
  throw new Error("cant find dockerRepository in `.yo-rc.json`. please udpate");
}

// 更新 env
let env = process.argv[2] || "pre";
srcEnvFile = path.join(srcEnvFile, `./${env}.env`);
let envContent = fs.readFileSync(srcEnvFile);
envContent = `DOCKER_REPOSITORY=${dockerRepository}
${envContent}`;
// 输出 Docker EnvFile
fs.writeFileSync(envFile, envContent);
