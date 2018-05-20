import * as path from "path";
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");

describe("generator:app", () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, "../generators/app"))
      .withPrompts({ appName: "toBeNo1" });
  });

  it("creates files", () => {
    assert.file([".npmrc", "package.json"]);
  });
});
