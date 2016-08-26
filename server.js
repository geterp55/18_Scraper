var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
// Notice: Our scraping tools are prepared, too
var request = require('request'); 
var cheerio = require('cheerio');

var errorHelper = require('mongoose-error-helper').errorHelper;
// use morgan and bodyparser with our app
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));

// make public a static dir
app.use(express.static('public'));

// Database configuration with mongoose
mongoose.connect('mongodb://localhost/articlescrape18');
var db = mongoose.connection;

// show any mongoose errors
db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

// once logged in to the db through mongoose, log a success message
db.once('open', function() {
  console.log('Mongoose connection successful.');
});

// And we bring in our Note and Article models
var Note = require('./models/Note.js');
var Article = require('./models/Article.js');

app.get('/', function(req, res) {
	res.send(index.html);
});

// =================================================================
//Routes
//------- Scrape go to app.js and send this to mongoDB
app.get('/scrape', function(req, res) {
	request('https://www.mongodb.com/blog', function(error, response, html) {
		var $ = cheerio.load(html);
		
		$('h3').each(function(i, element) {
			var result = {};
			
			result.title = $(element).text();
			// result.title = $(this).children('a').attr('h3').text();
			// result.link = $(this).children('div.terrible-layout').attr('p').text();
		// result.link = $(element).children('div.terrible-layout').attr('p');	
			var entry = new Article (result);

			entry.save(function(err, doc) {
				if(err) {
					console.log(err);
				}
				else {
					console.log(doc);

				}

			});
		});
	});
	res.send("Scrape Complete");
});

//-------  Send this to mongoDB
app.get('/articles', function(req, res) {

	Article.findOne({})
	.populate('note')
	.exec(function(err, doc){
		if (err){
			console.log(err);
		}
		else{
			res.json(doc);
		}
	});
});



app.listen(3000, function() {
	console.log('App running on port 3000!')
});




