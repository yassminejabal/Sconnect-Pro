const pool = require('../config/db')

async function get_Activity(req , res , id) {
    const query = `select * from activities WHERE activities.id = id`;
    const {rows} = await pool.query(query, [id]);
    return rows[0];
}
async function get_stats(req , res , id) {
    const query = `select a.Nom ,a.capacity , a.registered, a.fillRate from activities as a WHERE activities.id = id`;
    const {rows} = await pool.query(query, [id]);
    return rows[0];
}

module.exports = {get_Activity,get_stats};