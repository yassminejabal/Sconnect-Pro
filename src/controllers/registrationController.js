const { pool } = require("../config/db");
const { render } = require("../core/renderer");

async function index(req, res) {

    try {

        const result = await pool.query(`
            SELECT
                m.*,
                f.name AS family_name,
                f.quotient_familial
            FROM members m
            LEFT JOIN families f
                ON f.id = m.family_id
            ORDER BY m.last_name, m.first_name
        `);

        render(res, "pages/members", {
            title: "Adhérents",
            members: result.rows
        });

    } catch (error) {

        console.error(error);

        render(res, "error", {
            title: "Erreur",
            statusCode: 500,
            message: "Impossible de charger les adhérents"
        }, 500);
    }
}

module.exports = {
    index
};