const render = require("../core/renderer");
const { pool } = require("../config/db");

async function index(req, res) {
  try {
    const statsActivities = await pool.query("SELECT COUNT(*) AS total FROM activities");
    const statsFacilities = await pool.query("SELECT COUNT(*) AS total FROM facilities");

    const data = {
      title: "Accueil - SportConnect Pro",
      totalActivities: statsActivities.rows[0]?.total || 0,
      totalFacilities: statsFacilities.rows[0]?.total || 0,
    };

    render(res, "pages/dashboard", data);
  } catch (error) {
    console.error("Error in homeController:", error.message);
    render(res, "error", { error: "Erreur de chargement de l'accueil" }, 500);
  }
}
module.exports = { index };