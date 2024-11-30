const path = require("path");
const childProcess = require("child_process");
let Notebook;
try {
  Notebook = require("crossnote").Notebook;
} catch {
  childProcess.exec("npm i crossnote", {
    stdio: "inherit"
  }, () => {
    Notebook = require("crossnote").Notebook;
  });
};

Notebook.init({
  notebookPath: path.resolve("./pages/help/markdown"),
  config: {
    previewTheme: "github-light.css",
    mathRenderingOption: "KaTeX",
    codeBlockTheme: "github.css",
    printBackground: true,
    enableScriptExecution: true
  },
}).then((notebook) => {
  notebook.getNoteMarkdownEngine("markdown.md").htmlExport({
    offline: false,
    runAllCodeChunks: true
  }).then(() => childProcess.exec("npm uninstall crossnote", {
    stdio: "inherit"
  }));
});