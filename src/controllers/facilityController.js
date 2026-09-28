const { pool } = require("../config/db");
const { render } = require("../core/renderer");

async function index(req, res) {

    try {

        const result = await pool.query(`
            SELECT *
            FROM facilities
            ORDER BY name
        `);

        render(res, "pages/facilities", {
            title: "Infrastructures",
            facilities: result.rows
        });

    } catch (error) {

        console.error(error);

        render(res, "error", {
            title: "Erreur",
            statusCode: 500,
            message: "Impossible de charger les infrastructures"
        }, 500);
    }
}

module.exports = {
    index
};