const router = require("find-my-way")({
  defaultRoute: (req, res) => {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h1>404 - Page non trouvée</h1>");
  }
});
const familyController = require("../controllers/familyController");
const activitieController = require("../controllers/activitieController");
const homeController = require("../controllers/homeController");
const activityController = require("../controllers/activityController");


router.on("GET", "/", (req, res) => {
  homeController.index(req, res);
});
router.on("GET", "/activitiess/:id", (req, res,params) => {
  console.log(params);
  
  activitieController.getActivityById(req, res,params);
});




router.on("GET", "/dashboard", (req, res) => {
  homeController.index(req, res);
});


router.on("GET", "/activities", (req, res, params) => {
  activityController.listActivities(req, res, params);
});

router.on("GET", "/activities/new", (req, res, params) => {
  activityController.showCreateForm(req, res, params);
});

router.on("POST", "/activities", (req, res, params) => {
  activityController.handleCreate(req, res, params);
});

router.on("GET", "/activities/:id", (req, res, params) => {
  activityController.showActivity(req, res, params);
});

router.on("GET", "/activities/:id/edit", (req, res, params) => {
  activityController.showEditForm(req, res, params);
});

router.on("POST", "/activities/:id/edit", (req, res, params) => {
  activityController.handleUpdate(req, res, params);
});

router.on("POST", "/activities/delete/:id", (req, res, params) => {
  activityController.deleteActivity(req, res, params);
});
router.on("GET", "/activitie/stats", (req, res, params) => {
  activityController.deleteActivity(req, res, params);
});




router.on("GET", "/families", (req, res) => familyController.getAllFamilies(req, res));
router.on("GET", "/families/new", (req, res) => familyController.createFamily(req, res));







module.exports = (req, res) => {
  router.lookup(req, res);
};