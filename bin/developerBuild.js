#! /usr/bin/env node
const { developerBuild } = require("../package.js");

developerBuild().then(({ stdout }) => {
  console.log(stdout);
}).catch(({ stderr }) => {
  throw stderr;
});