const path = require("path");
const { Notebook } = require("crossnote");

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
  });
});