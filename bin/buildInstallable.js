#! /usr/bin/env node
const { buildInstallable } = require("../package.js");

buildInstallable().then(({ stdout }) => {
  console.log(stdout);
}).catch(({ stderr }) => {
  throw new Error(stderr);
});