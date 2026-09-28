const { pool } = require("../config/db");
async function getAllActivities() {
  const query = `
    SELECT a.*, f.name AS facility_name, ass.name AS association_name
    FROM activities a
    LEFT JOIN facilities f ON a.facility_id = f.id
    LEFT JOIN associations ass ON a.association_id = ass.id
    ORDER BY a.id ASC;
  `;
  const { rows } = await pool.query(query);
  return rows;
}

async function getActivityById(id) {
  const query = `
    SELECT a.*, f.name AS facility_name, ass.name AS association_name
    FROM activities a
    LEFT JOIN facilities f ON a.facility_id = f.id
    LEFT JOIN associations ass ON a.association_id = ass.id
    WHERE a.id = $1;
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
}

async function createActivity(data) {
  const { association_id, facility_id, name, description, base_price, max_capacity, day_of_week, start_time, end_time, age_category } = data;
  const query = `
    INSERT INTO activities (association_id, facility_id, name, description, base_price, max_capacity, day_of_week, start_time, end_time, age_category)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;
  `;
  const values = [association_id, facility_id, name, description, base_price, max_capacity, day_of_week, start_time, end_time, age_category];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function updateActivity(id, data) {
  const { association_id, facility_id, name, description, base_price, max_capacity, day_of_week, start_time, end_time, age_category } = data;
  const query = `
    UPDATE activities
    SET association_id = $1, facility_id = $2, name = $3, description = $4,
        base_price = $5, max_capacity = $6, day_of_week = $7, start_time = $8,
        end_time = $9, age_category = $10
    WHERE id = $11
    RETURNING *;
  `;
  const values = [association_id, facility_id, name, description, base_price, max_capacity, day_of_week, start_time, end_time, age_category, id];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function deleteActivity(id) {
  const query = "DELETE FROM activities WHERE id = $1 RETURNING *;";
  const { rows } = await pool.query(query, [id]);
  return rows[0];
}

async function getActivityFormOptions() {
  const [facilities, associations] = await Promise.all([
    pool.query("SELECT id, name FROM facilities ORDER BY name"),
    pool.query("SELECT id, name FROM associations ORDER BY name")
  ]);
  return { facilities: facilities.rows, associations: associations.rows };
}

module.exports = {
  getAllActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
  getActivityFormOptions,
};