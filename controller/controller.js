//Dependencies
// var bodyParser = require('body-parser');
// var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var mongoose = require('mongoose');
var logger = require('morgan');
var axios = require('axios');

//Require models
// var Note = require('../models/note.js');
// var Article = require('../models/article.js');

var db = require('../models');


//Initialize Express 
// var app = express();

module.exports = function(app) {
    app.use(logger('dev'));
    //Connect to DB
var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/futurism';
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Use morgan logger for logging requests
//app.use(logger('dev'));
//User body parser
//app.use(bodyParser.urlencoded({ extended: true }));
//Use express.static
//app.use(express.static('public'));

// module.exports = {
// //Routes
// //A GET route scraping futurism
// webScrape: function(){
//     // app.get('/scrape', function(req, res){
//     //     controller.webScrape();
//     //     res.send('Scrape Complete')
//     //   })
//         request.get('https://futurism.com/', function(error, response, body){
//             var $ = cheerio.load(body);
//             var articles = [];
//             $('.title').each(function(i, element){
//                 var article = {
//                     title: element.attribs.title,
//                     link: element.attribs.href
//                     // saved: element.attribute.subtitle,
//                 };
//                 // console.log(element.attribs.title + '\n' + element.attribs.href);
//                 articles.push(article);
//             });

//             Article.insertMany(articles);
//         });
//     }
// };

//ROUTES
//====================================================
//Scraper

        app.get('/scrape', function (req, res) {
            axios.get('https://futurism.com/').then(function (response) {
                //Cheerio
                var $ = cheerio.load(response.data);
                var allArticles = [];
                $('.title').each(function(i, element){
                    var result = {};
                    result.title = $(this).children('a').text;
                    result.link = $(this).children('a').href;

                db.Article.create(result).then(function(dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    return res.json(err)
                });
            });
            res.redirect('/')
        });
    });

        app.get('/clear', function(req, res) {
            db.Article.remove({}, function(err, doc) {
                if(err) {
                    console.log(err);
                }
                else {
                    console.log('removed all articles');
                    res.redirect('/');
                }
            })
        })

//Route for getting all Articles from the db
        app.get('/articles', function(req, res) {
            db.Article.find({saved: false})
                .then(function(dbArticle) {
                    res.json(dbArticle);
                })
                .catch(function(err){
                res.json(err);
            });
        });


        app.get('/savedArticles', function(req, res) {
            db.Article.find({saved: true})
                .then(function(dbArticle) {
                    res.json(dbArticle);
                })
                .catch(function(err){
                    res.json(err);
                });
        });


        app.get('/deleteArticle/:id', function(req, res){
            db.Article.findOneAndUpdate({_id: req.params.id }, {saved: false})
            .then(function(dbArticle) {
                res.json(dbArticle);
            })
            .catch(function(err) {
                res.json(err)
            });
        });

        app.get('/articles/:id', function (req, res) {
            db.Article.findOne({ _id: req.params.id })
            .populate('note')
            .then(function(dbArticle) {
                res.json(dbArticle);
            })
            .catch(function(err) {
                res.json(err);
            });
        });

        app.post('/articles/:id', function(req, res) {
            db.Note.create(req.body)
            .then(function(dbNote) {
                return db.Article.findByIdAndUpdate({_id: req.params.id}, {note: dbNote._id}, {new: true });
            })
            .then(function(dbArticle) {
                res.json(dbArticle);
            })
            .catch(function(err) {
                res.json(err);
            });
        });

        app.post('/savedArticles/:id', function(req, res) {
            db.Article.findOneAndUpdate({_id: req.params.id}, {saved: true}).then(function(dbRes){
                res.direct('/')
            });
        });
    }
    
//     //Route to render home
//     app.get('/', function(req, res) {
//         res.render('index')
//     });


//     //Route to render saved page
//     app.get('/saved', function(res, req) {
//         res.render('saved')
//     });
// };
