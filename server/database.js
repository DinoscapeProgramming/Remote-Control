Object.assign(process.env, (require("fs").readdirSync("./").includes(".env")) ? require("fs").readFileSync("./.env", "utf8").split("\n").filter((line) => !line.startsWith("#") && (line.split("=").length > 1)).map((line) => line.trim().split("#")[0].split("=")).reduce((data, accumulator) => ({
  ...data,
  ...{
    [accumulator[0]]: JSON.parse(accumulator[1].trim())
  }
}), {}) : {});
const https = require("https");
const fetch = (url, { method = "GET", headers = {}, body } = {}) => new Promise((resolve, reject) => {
  let request = https.request(url, {
    method,
    headers
  }, (response) => {
    let responseData = "";
    response.on("data", (chunk) => responseData += chunk);
    response.on("end", () => {
      resolve({
        statusCode: response.statusCode,
        headers: response.headers,
        json: () => new Promise((resolve, reject) => {
          try {
            resolve(JSON.parse(responseData))
          } catch {
            reject("Invalid JSON response");
          };
        }),
        text: () => new Promise((resolve, reject) => resolve(responseData))
      });
    });
  });
  request.on("error", (err) => reject(err));
  if (body) request.write((typeof body === "string") ? body : JSON.stringify(body));
  request.end();
});
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
      body: databaseContent
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