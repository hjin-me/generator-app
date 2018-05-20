// Then we find all the tests.
const context = require.context("./", true, /\.spec\.tsx?$/);
// And load the modules.
context.keys().map(context);
