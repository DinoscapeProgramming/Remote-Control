#! /usr/bin/env node
const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

if (!["win32", "darwin", "linux"].includes(process.platform) || process.argv.slice(2).map((argument) => ["-mwl", "--win", "--mac", "--darwin", "--linux"].includes(argument)).includes(false)) process.exit(1);
try {
  childProcess.exec("electron-builder " + Array.from(new Set(process.argv.slice(2))).join(" "), (err, stdout, stderr) => {
    if (err || stderr) throw new Error(err?.message || stderr);
    console.log(stdout);
  });
} catch (err) {
  throw new Error(err.message);
};