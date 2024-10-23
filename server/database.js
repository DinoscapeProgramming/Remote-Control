require("dotenv").config();
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = {
  readDatabase: (databaseName) => new Promise((resolve, reject) => {
    fetch("https://api.jsonbin.io/v3/b/" + process.env["DATABASE_" + databaseName.toUpperCase()] + "/latest", {
      method: "GET",
      headers: {
        'X-Master-Key': process.env.DATABASE_KEY
      }
    })
    .then((response) => response.json())
    .then(({ message, record }) => {
      if (message) reject({ err: message, [databaseName]: null });
      resolve({ err: null, [databaseName]: record });
    })
    .catch((err) => reject({ err, [databaseName]: null }));
  }),
  updateDatabase: (databaseName, databaseContent) => new Promise((resolve, reject) => {
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
      resolve({ err: null });
    })
    .catch((err) => reject({ err, [databaseName]: null }));
  })
};