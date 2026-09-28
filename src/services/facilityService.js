const pool = require("../config/db").pool || require("../config/db");

async function getAllFacilities() {
  const result = await pool.query("SELECT id, name FROM facilities ORDER BY name ASC");
  return result.rows;
}

module.exports = {
  getAllFacilities,
};