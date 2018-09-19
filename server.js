var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var logger = require("morgan");
// var hbs = require('express-handlebars');
// var path = require("path");
// var axios = require("axios");
var request = require("request");
var PORT = 3000;

var db = require("./models");


var app = express();

app.use(express.static("public"));

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));




mongoose.connect("mongodb://localhost/New_York_Times_Tec", { useNewUrlParser: true });

// Scrape 
app.get("/scrape", function (req, res) {

    request("https://www.nytimes.com/section/technology", function (err, response, html) {
        // console.log("yoooooo", a .title);
        var $ = cheerio.load(html);

        // res.send(html);

        $("ol.story-menu.theme-stream.initial-set").children("li").each(function (i, element) {

            var articles = {};
            var headlineMess = $(element).children(".story").children(".story-body").children(".story-link").children(".story-meta").children(".headline").text();
            articles.title = headlineMess.split("\n").map(function (a) { return a.trim() })[1]
            articles.summary = $(element).children(".story").children(".story-body").children(".story-link").children(".story-meta").children(".summary").text();
            articles.link = $(element).children(".story").children(".story-body").children(".story-link").attr("href");
            // console.log(story)

            // var headline = $("h2.headline").text();
            // var body = $("p.summary").text();
            db.Article.create(articles, function (err) {
                if (err) {
                    res.status("500");
                }
            });
            console.log(articles);

            // console.log(body);

            // console.log(story);
        });

        //  console.log($);
        res.send("Scrape Completed");
    });

});

app.get("/articles", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
        .then(function (dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

app.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
        // ..and populate all of the notes associated with it
        .populate("notes")
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function (dbNote) {
            // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true });
        })
        .then(function (dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

app.delete("/notes/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.deleteOne({ _id: req.params.id })
        // ..and populate all of the notes associated with it
        .then(function (dbNote) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbNote);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

app.get("/notes", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Note.find({})
        .then(function (dbNote) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbNote);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});


app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
