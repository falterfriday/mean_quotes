var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
// -------------------mongoose-------------------------
mongoose.connect('mongodb://localhost/quotes_db');
var QuoteSchema = new mongoose.Schema({
	name: String,
	quote: String,
	date: Date
});
mongoose.model('Quote', QuoteSchema);
var Quote = mongoose.model('Quote');
//-----------------------------------------------------
app.use(bodyParser.urlencoded({ extended:true}));
var path = require('path');
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

//-----------load-index--------------------------------
app.get('/', function(req, res) {
			res.render('index');
});
//-----------submit-quote--------------------------------
app.post('/quotes', function(req, res) {
	console.log(req.body);
	var quote = new Quote({ name: req.body.name, quote: req.body.quote, date: new Date()} );
	quote.save(function(err) {
		if (err){
			console.log('something went wrong');
			res.redirect('/');
		}
		else {
			console.log('successfully added quote');
			Quote.find( {} , function(err, quotes) {
				if (err) {
					console.log('error');
				}
				else {
					console.log('found the quotes');
					res.render('quotes', { quotes: quotes });
				}
			});
		}
	});
});
//-----------quotes-page-------------------------------
app.get('/quotes', function(req, res) {
	Quote.find( {} ,  function(err, quotes) {
		if (err) {
			console.log('error');
		}
		else {
			console.log('found the quotes');
			res.render('quotes', { quotes: quotes });
		}
	});
});
//-----------------------------------------------------
app.listen(8000, function(){
	console.log("listening on port 8000");
});
