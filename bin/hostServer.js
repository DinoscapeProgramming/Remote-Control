#! /usr/bin/env node
const { hostServer } = require("../package.js");

hostServer().then(({ stdout }) => {
  console.log(stdout);
}).catch(({ stderr }) => {
  throw stderr;
});