Object.assign(process.env, require("fs").readFileSync(require("path").join(process.resourcesPath, "app.asar/.env"), "utf8").split("\n").filter((line) => !line.startsWith("#")).map((line) => line.split("=")).reduce((data, accumulator) => ({
  ...data,
  ...{
    [accumulator[0]]: JSON.parse(accumulator[1])
  }
}), {}));
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
let databaseCache = {};

module.exports = {
  readDatabase: (databaseName) => new Promise((resolve, reject) => {
    if (databaseCache[databaseName] && ((Date.now() - databaseCache[databaseName].timestamp) < 86400000)) return resolve({ err: null, [databaseName]: databaseCache[databaseName].data });
    fetch("https://api.jsonbin.io/v3/b/" + process.env["DATABASE_" + databaseName.toUpperCase()] + "/latest", {
      method: "GET",
      headers: {
        'X-Master-Key': process.env.DATABASE_KEY
      }
    })
    .then((response) => response.json())
    .then(({ message, record }) => {
      if (message) reject({ err: message, [databaseName]: null });
      databaseCache[databaseName] = {
        data: record,
        timestamp: Date.now()
      };
      resolve({ err: null, [databaseName]: record });
    })
    .catch((err) => reject({ err, [databaseName]: null }));
  }),
  updateDatabase: (databaseName, databaseContent) => new Promise((resolve, reject) => {
    if ((Date.now() - databaseCache[databaseName].timestamp) < 86400000) return ((cache[databaseCache] = {
      data: databaseContent,
      timestamp: Date.now()
    }), resolve({ err: null }));
    fetch("https://api.jsonbin.io/v3/b/" + process.env["DATABASE_" + databaseName.toUpperCase()], {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': process.env.DATABASE_KEY
      },
      body: JSON.stringify(databaseContent)
    })
    .then((response) => response.json())
    .then(({ message }) => {
      if (message) reject({ err: message });
      databaseCache[databaseName] = {
        data: record,
        timestamp: Date.now()
      };
      resolve({ err: null });
    })
    .catch((err) => reject({ err, [databaseName]: null }));
  })
};