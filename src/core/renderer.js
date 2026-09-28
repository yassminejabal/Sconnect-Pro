// src/core/renderer.js
const path = require("path");
const fs = require("fs");
const ejs = require("ejs");

function render(res, viewName, data = {}, statusCode = 200) {

  let filePath = path.join(__dirname, "../views", `${viewName}.ejs`);

  if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, "../../views", `${viewName}.ejs`);
  }

  if (!fs.existsSync(filePath)) {
    console.error(`[Renderer] View introuvable: ${filePath}`);
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end(`404 - Fichier de vue introuvable: ${viewName}.ejs`);
  }

  // Render للملف عبر EJS
  ejs.renderFile(filePath, data, (err, html) => {
    if (err) {
      console.error("[Renderer] Erreur EJS:", err);
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("500 - Erreur de rendu de la vue: " + err.message);
    }

    res.writeHead(statusCode, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
  });
}

// تصدير الدالة مباشرة
module.exports = render;