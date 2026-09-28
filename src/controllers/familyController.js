const { pool } = require("../config/db");
const querystring = require("querystring");
const familyService = require("../services/familyService");
const render = require("../core/renderer");

// دالة مساعدة لقراءة بيانات الـ POST من الـ Stream
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });
    req.on("end", () => {
      resolve(querystring.parse(body));
    });
    req.on("error", err => {
      reject(err);
    });
  });
}

// دالة store الخاصة بالـ Controller
async function store(req, res) {
  try {
    // 1. استخراج البيانات من الطلب
    const body = await parseBody(req);

    // 2. التحقق من الحقول الإجبارية
    if (!body.name || !body.name.trim()) {
      return render(res, "pages/family-form", {
        error: "Le nom du foyer est obligatoire."
      }, 400);
    }

    // 3. إرسال البيانات للـ Service لتسجيلها في PostgreSQL
    await familyService.createFamily({
      name: body.name.trim(),
      quotient_familial: body.quotient_familial,
      is_resident: body.is_resident, // إذا كانت checked فـ HTML Form كتوصل "on"
      address: body.address ? body.address.trim() : null
    });

    // 4. إعادة التوجيه إلى لائحة العائلات بعد النجاح
    res.writeHead(302, { Location: "/families" });
    res.end();
  } catch (error) {
    console.error("❌ Erreur store family:", error.message);
    render(res, "pages/family-form", {
      error: "Erreur lors de l'enregistrement : " + error.message
    }, 500);
  }
}









// جلب كل العائلات مع عدد الأفراد المسجلين
async function getAllFamilies() {
  const query = `
    SELECT f.*, COUNT(m.id) AS members_count
    FROM families f
    LEFT JOIN members m ON m.family_id = f.id
    GROUP BY f.id
    ORDER BY f.name ASC;
  `;
  const result = await pool.query(query);
  return result.rows;
}

// جلب عائلة محددة عبر الـ ID
async function getFamilyById(id) {
  const result = await pool.query("SELECT * FROM families WHERE id = $1", [id]);
  return result.rows[0];
}

// إنشاء عائلة جديدة
async function createFamily({ name, quotient_familial, is_resident, address }) {
  const query = `
    INSERT INTO families (name, quotient_familial, is_resident, address)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [
    name,
    parseFloat(quotient_familial) || 0,
    is_resident === "true" || is_resident === true || is_resident === "on",
    address || null
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
}

module.exports = {
  getAllFamilies,
  getFamilyById,
  createFamily,
  store
};