
// pour faire la gestion des chemins
const path = require("path");

// __dirname donne le chemain de docier acteil
// path.resolve donne le grande chemain 
// require("dotenv") 
require("dotenv").config({ path: path.resolve(__dirname, "../.env")});
// pour cree servre http
const http = require("http");
const serveStatic = require("serve-static");
// pour lire les ficher static =>{css image js}
const { connectionDb } = require("./config/db");
const handleRequest = require("./core/router");

const PORT = process.env.PORT || 3000;
const serve = serveStatic(path.join(__dirname, "../public"));

const server = http.createServer((req, res) => {
  serve(req, res, () => handleRequest(req, res));
});

async function start() {
  await connectionDb();
  server.listen(PORT); 
}

start();