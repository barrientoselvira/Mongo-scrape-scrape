//Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
// var mongoose = require('mongoose');
var exphbs = require('express-handlebars');
var path = require('path');

//Initialize Express
var PORT = 3000;

var app = express();

//Get controller
// var controller = require('./controller/controller.js')(app);
var controller = require('./controller/controller.js')(app);


//Use morgan logger for logging requests
app.use(logger('dev'));
//User body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Use express.static to serve the public folder as a static directory
app.use(express.static( 'public'));

app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
// app.get('/', function (req, res) {
//   res.render('home');
// });
// app.get('/scrape', function(req, res){
//   controller.webScrape();
//   res.send('Scrape Complete')
// })


// //Connect to DB
// var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/futurism';
// mongoose.Promise = Promise;
// mongoose.connect(MONGODB_URI);

//Require routes


//Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });