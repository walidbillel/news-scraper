var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var hbs = require('express-handlebars');
var path = require("path");
var PORT = 3000;

// var db = require("./models");s

var app = express();

var routes = "./routes";

// app.use(routes);
mongoose.connect("mongodb://localhost/insider_db", { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, './views'));
app.engine('hbs', hbs({extname: '.hbs', defaultLayout: 'main'}))
app.set('view engine', 'hbs');

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
