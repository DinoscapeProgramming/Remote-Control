#! /usr/bin/env node
const { openInstallable } = require("../package.js");

openInstallable().then(({ stdout }) => {
  console.log(stdout);
}).catch(({ stderr }) => {
  throw stderr;
});