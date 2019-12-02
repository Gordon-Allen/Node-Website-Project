var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false});
var content = require('../gman_details.json');

module.exports = function(app) {

    app.get('/', function(req, res) {
        res.render("index");
    });

    app.get('/detail', function(req,res) {
        var gman_details = [content];
        res.render("detail", {d_cnt: gman_details});
    });


    app.get('/family', function(req,res) {
        var gman_family_details = [content];
        res.render("family", {d_cnt: gman_family_details});
    });
    

    app.post('/family', function(req,res) {
        console.log(req.body.f_member);
        var f_member = req.body.f_member;
        res.redirect('/family/' + f_member);
    });
    
    app.get('/family/:f_member', function(req,res) {
        var f_member = req.params.f_member;
        var gman_family_member_details = [content];
        console.log(f_member);
        res.render('familydetail', {f_member: f_member, d_cnt: gman_family_member_details})
    });
    
    app.get('/family/:f_member', function(request,response, next) {
        if (str[f_member]) {
            var f_member = request.params.f_member;
            console.log(f_member)
            response.render('familydetail', {f_member: f_member, str: str, m_info: str[f_member]})
        }
        else {
            var httpError = next(createError(401, 'Sorry that family memeber does not exist or an error occurred!'));
            response.send(httpError);
        }
    });
}
