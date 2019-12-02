var content = require('../gman_details.json');

module.exports = function(app) {

    app.get('/api', function(req,res) {
        res.render('api')
    });
    
    app.get('/api/gman_details', function(req,res) {
        res.json(content.info.gman_personal);
    });
    
    app.get('/api/gman_fam_details', function(req,res) {
        res.json(content.info.gman_family);
    });
    
    app.get('/api/all_details', function(req,res) {
        res.json(content);
    });
    
}
