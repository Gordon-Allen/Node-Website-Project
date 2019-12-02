var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');

var fileUpload = require('express-fileupload');

var urlencodedParser = bodyParser.urlencoded({ extended: false});

var homeController = require('./controllers/homeController');
var apiController = require('./controllers/apiController');

app.use(bodyParser.json());

var port = process.env.PORT || 3000;


app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');

app.set('view engine', 'ejs');

app.use(fileUpload());

app.get('/form', function(req,res) {
    res.render("form");
});

app.post('/form', urlencodedParser, function(req,res) {
    if(req.body.first_name == "" || req.body.last_name == ""|| req.body.email == ""|| req.body.comment == "") {
        res.status(422);
        res.render("error", 'ERROR: Failed to add item in table: Please submit first_name, last_name, email, & comment');
    }

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        database: "nodewebsiteproject_db"
    });
    let f_upload = req.files.f_upload;
    console.log(f_upload);
    var uploadPath = __dirname + '/uploads/' + f_upload.name;
    console.log(uploadPath);

    f_upload.mv(uploadPath, function(err){
        if(err) {
            res.status(500);
            res.render("error", 'ERROR: Failed to upload user image/file');
            throw err;
        }})

    con.query("INSERT INTO nodewebsiteproject_db.form_submission (first_name, last_name, email, comment, f_upload) VALUES('"+req.body.first_name+"', '"+req.body.last_name+"','"+req.body.email+"','"+req.body.comment+"','"+req.files.f_upload.name+"');", function(err, rows) {
        if(err){
            res.status(422);
            res.render("error", 'ERROR: Failed to add item in table');
            throw err;
        } 
        console.log(rows[0]);
        }
    );
    res.render('formsuccess');
});

app.get('/guestbook', function(req,res) {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        database: "nodewebsiteproject_db"
    });
    con.query("SELECT first_name, last_name, email, f_upload, form_submission_id FROM form_submission", function(err, result) {
        if(err){
            res.status(500);
            res.render("error", 'ERROR: Failed to retrieve records');
            throw err;
        } 
        console.log(result);
        res.render('guestbook', {q_result: result});
        }
    );
});

app.get('/guestbook/delete/:form_submission_id', function(req, res) {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        database: "nodewebsiteproject_db"
    });
    con.query("DELETE FROM form_submission WHERE form_submission_id = '"+req.params.form_submission_id+"'", function(err, result) {
        if(err){
            res.status(500);
            res.render("error", 'ERROR: Failed to delete record');
            throw err;
        } 
        res.render('index');
        }
    );
});

homeController(app);
apiController(app);

app.listen(port, function(){
    console.log("listening on port 3000");
})