const activitieService = require('../services/activitieService');

 function getActivityById(req , res , params){
    // const ids = params.id;
    // console.log(ids);
    
    const activety =  activitieService.get_Activity(params.id);
    if (!activety) {
        return " error aucun activity";
    }
}
function stats(req , res , params){
    const get_stats =  activitieService.get_stats(params.id);
}


    module.exports = {getActivityById,stats}