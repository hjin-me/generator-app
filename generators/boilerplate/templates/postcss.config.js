let autoprefixer = require("autoprefixer");

module.exports = {
  plugins: [
    autoprefixer({
      browsers: ["last 10 version", ">1%"]
    })
  ]
};
