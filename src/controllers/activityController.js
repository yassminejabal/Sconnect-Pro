const activityService = require("../services/activityService");
const render = require("../core/renderer");
const querystring = require("querystring");
const { text } = require("node:stream/consumers");

async function parseBody(req) {
  // text kayjma3 lina data li jaya man 3and user
  const body = await text(req);
  // querystring hadi hiya li kat9ra dak string au kathawlo objet
  return querystring.parse(body);
}
function normalizeActivityData(formData) {
  return {
    name: formData.name,
    description: formData.description,
    association_id: parseInt(formData.association_id, 10),
    facility_id: parseInt(formData.facility_id, 10),
    base_price: parseFloat(formData.base_price),
    max_capacity: parseInt(formData.max_capacity, 10),
    day_of_week: parseInt(formData.day_of_week, 10),
    start_time: formData.start_time,
    end_time: formData.end_time,
    age_category: formData.age_category,
    price: formData.price,
    duration: formData.duration,
  };
}

async function listActivities(req, res) {
  try {
    const activities = await activityService.getAllActivities();
    render(res, "pages/activities", { activities });
  } catch (error) {
    render(res,"error",{ error: "Erreur de chargement: " + error.message },500,);
  }
}

async function showActivity(req, res, params) {
  try {
    const activityId = params.id;
    const activity = await activityService.getActivityById(activityId);

    if (!activity) {
      return render(res, "error", { error: "Activité non trouvée" }, 404);
    }

    render(res, "pages/activity-details", {
      activity: activity,
      title: activity.name,
    });
  } catch (error) {
    console.error("Erreur show activity:", error.message);
    render(res, "error", { error: "Erreur serveur: " + error.message }, 500);
  }
}

async function showCreateForm(req, res) {
  try {
    const { facilities, associations } =
      await activityService.getActivityFormOptions();

    render(res, "pages/activity-form", {
      activity: {},
      facilities: facilities,
      associations,
      isEdit: false,
    });
  } catch (error) {
    console.error("Erreur chargement formulaire activité:", error.message);
    render(
      res,
      "error",
      { error: "Impossible de charger les infrastructures: " + error.message },
      500,
    );
  }
}
async function handleCreate(req, res) {
  try {
    const   formData = await parseBody(req);
    const activityData = normalizeActivityData(formData);

    await activityService.createActivity(activityData);

    res.writeHead(302, { Location: "/activities" });
    res.end();
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'activité :", error);
    render(res, "error", { error: "Erreur enregistrement: " + error.message }, 500);
  }
}
async function showEditForm(req, res, params) {
  try {
    const activity = await activityService.getActivityById(params.id);
    if (!activity) {
      return render(res, "error", { error: "Activité introuvable" }, 404);
    }
    const { facilities, associations } =
      await activityService.getActivityFormOptions();
    render(res, "pages/activity-form", {
      activity,
      facilities,
      associations,
      isEdit: true,
    });
  } catch (error) {
    render(res, "error", { error: error.message }, 500);
  }
}
async function handleUpdate(req, res, params) {
  try {
    const formData = await parseBody(req);
    const activityData = normalizeActivityData(formData);

    await activityService.updateActivity(params.id, activityData);

    res.writeHead(302, { Location: "/activities" });
    res.end();
  } catch (error) {
    render(res, "error", { error: "Erreur de mise à jour: " + error.message }, 500);
  }
}

async function deleteActivity(req, res, params) {
  try {
    const activityId = params.id;
    await activityService.deleteActivity(activityId);

    res.writeHead(302, { Location: "/activities" });
    res.end();
  } catch (error) {
    console.error("Erreur suppression activité:", error.message);
    render(
      res,
      "error",
      { error: "Impossible de supprimer l'activité: " + error.message },
      500,
    );
  }
}
module.exports = {
  listActivities,
  showActivity,
  showCreateForm,
  handleCreate,
  showEditForm,
  handleUpdate,
  deleteActivity,
};
