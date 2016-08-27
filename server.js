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

// this will get the articles we scraped from the mongoDB
app.get('/articles', function(req, res) {
	Article.find({}, function(err, doc) {
		if (err){
			console.log(err);
		}
		else {
			res.json(doc);
		}
	});
});

// grab an article by it's ObjectId
app.get('/articles/:id', function(req, res) {
	Article.findOne({'_id': req.params.id}).populate('Note').exec(function(err, doc){
		if(err) {
			console.log(err);
		}
		else{
			res.json(doc);
		}
	});
});


app.post('/articles/:id', function(req, res){
	// create a new note and pass the req.body to the entry.
	var newNote = new Note(req.body);

	// and save the new note the db
	newNote.save(function(err, doc){
		// log any errors
		if(err){
			console.log(err);
		} 
		// otherwise
		else {
			// using the Article id passed in the id parameter of our url, 
			// prepare a query that finds the matching Article in our db
			// and update it to make it's lone note the one we just saved
			Article.findOneAndUpdate({'_id': req.params.id}, {'Note':doc._id})
			// execute the above query
			.exec(function(err, doc){
				// log any errors
				if (err){
					console.log(err);
				} else {
					// or send the document to the browser
					res.send(doc);
				}
			});
		}
	});
});


















app.listen(3000, function() {
	console.log('App running on port 3000!')
});




