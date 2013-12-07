
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user') // user = stats
  , http = require('http')
  , path = require('path');

var app = express();

var Kaiseki = require('kaiseki');

var kaiseki_app_id = process.env.ID;
var kaiseki_rest_aki_key = process.env.KEY;
var kaiseki = new Kaiseki(kaiseki_app_id, kaiseki_rest_aki_key);

var mail = require("nodemailer").mail;



// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.post('/', function(req, res){
	var post = new Array;
	post.url = req.param('url');
	post.reason = req.param('reason');
	post.message = req.param('reason');
	post.contactPerson = req.param('reason');
	post.name = req.param('reason');
	post.email = req.param('reason');
	savePost(post);
	sendMail(post);
	res.redirect('/stats');
/*	
    articleProvider.save({
        title: req.param('title'),
        body: req.param('body')
    }, function( error, docs) {
        res.redirect('/')
    });
*/
});

app.get('/stats', user.list); // user = stats


/* 
 PARSE.COM + KAISEKI
*/

function savePost(post) {

	var post = {
		domain: post.url,
		reason: post.reason
	};
	var className = 'Posts';
	
	kaiseki.createObject(className, post, function(err, res, body, success) {
	  console.log('object created = ', body);
	  console.log('object id = ', body.objectId);
	});
}


function sendMail(post) {
	mail({
		from: "451.ee ✔ <info@451.ee>", // sender address
		to: post.contactPerson, // list of receivers
		subject: "Info eemaldamise palve", // Subject line
		text: "Hello world ✔", // plaintext body
		//html: "<b>Hello world ✔</b>" // html body
	});	
}





process.on('uncaughtException', function (exception) {
  console.log(exception);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
