
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes') 
  , stats = require('./routes/stats') // user = stats
  , http = require('http')
  , path = require('path');

var app = express();

var Kaiseki = require('kaiseki');

var kaiseki_app_id = process.env.ID;
var kaiseki_rest_aki_key = process.env.KEY;
var kaiseki = new Kaiseki(kaiseki_app_id, kaiseki_rest_aki_key);

var nodemailer = require('nodemailer');
var transport = nodemailer.createTransport("Direct", {debug: true});

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
	post.message = req.param('message');
	post.contactPerson = req.param('contactPerson');
	post.name = req.param('name');
	post.email = req.param('email');
	savePost(post);
	sendMail(post);
	res.redirect('/stats');
});

//app.get('/stats', stats.list); // user = stats

/*
        articleProvider.findLast( function(error,docs){
            res.render('index.jade', { 
                articles:docs,
                conf: conf.general
            });
        res.end();
*/
			
app.get('/stats', function(req, res){
	var posts = getPosts();

	//articleProvider.findLast( function(error,docs){
		res.render('stats.jade', {  // SIIA SISSSSSE!!!!!
			articles:posts
			//conf: conf.general
		});
		res.end();
	//})
});
			



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
	
	var mailContent = createMail(post);
	console.log(mailContent);
			
	var message = {
	
		// sender info
		from: "451.ee <info@451.ee>",
	
		// Comma separated list of recipients
		to: post.contactPerson,
	
		// Subject of the message
		subject: "Info eemaldamise palve", //
	
		// plaintext body
		text: mailContent,
	
		// HTML body
		//html:'<p><b>Hello</b> to myself <img src="cid:note@node"/></p>'+
		//	 '<p>Here\'s a nyan cat for you as an embedded attachment:<br/><img src="cid:nyan@node"/></p>',
	
	};	

	console.log('Sending Mail');
	
	transport.sendMail(message, function(error, response){
		if(error){
			console.log('Error occured');
			console.log(error.message);
			return;
		}else{
			console.log(response);
			console.log('Message sent successfully!');
		}
	});

}

//getPosts();
function getPosts() {

	var daData = new Array;

	// query with parameters
	var params = {
		order: '-createdAt',
		limit: 10
	};
		
	// I AM SO SORRY FOR QUERYING LIKE THIS BUT IT'S 10:49 PM AND I STILL HAVE A LOT TO DO!!!!
	var params1 = {
		where: {"reason":"r1"},
		count: 1,
		limit: 0
	};

	var params2 = {
		where: {"reason":"r2"},
		count: 1,
		limit: 0
	};

	var params3 = {
		where: {"reason":"r3"},
		count: 1,
		limit: 0
	};
	var params4 = {
		where: {"reason":"r4"},
		count: 1,
		limit: 0
	};
	var params5 = {
		where: {"reason":"r5"},
		count: 1,
		limit: 0
	};

	var pppposts = kaiseki.getObjects('Posts', params, function(err, res, body, success) {
		daData.lastPosts = body;
	});
	
	var rrr1 = kaiseki.getObjects('Posts', params1, function(err, res, body, success) {
	  //console.log('r1 = ', body);
		daData.r1 = body;
	});
	var rrr2 = kaiseki.getObjects('Posts', params2, function(err, res, body, success) {
	  //console.log('r2 = ', body);
		daData.r2 = body;
	});
	var rrr3 = kaiseki.getObjects('Posts', params3, function(err, res, body, success) {
	  //console.log('r3 = ', body);
		daData.r3 = body;
	});
	var rrr4 = kaiseki.getObjects('Posts', params4, function(err, res, body, success) {
	  //console.log('r4 = ', body);
		daData.r4 = body;
	});
	var rrr5 = kaiseki.getObjects('Posts', params5, function(err, res, body, success) {
	  //console.log('r5 = ', body);
		daData.r5 = body;
		//console.log(daData.lastPosts);
	});
	
	//console.log(daData);
	return daData;
}

function createMail(post) {

	var content = "Lugupeetud veebihaldur!\r\n\r\nKirjutame Teile lehelt www.451.ee. Meie eesmärk on Internetikeskkonna turvalisemaks ja lugupidavamaks muutmine.\r\n\r\nPöördume Teie poole seoses järgneva lingi / pildi avaldamisega Teie veebilehel:\r\n\r\n";
	content += post.url;
	content += "\r\n\r\nMeie poole on pöördutud seoses sellel lingil toimuva isikuandmete kaitsega seotud õiguste rikkumisega. \r\n\r\nPeaksite viidatud andmed viivitamata oma veebilehelt eemaldama.";
	
	switch(post.reason) {
		case "r1": // Isikuandmeid puudutava sisu eemaldamine 
		content += "Isikuandmeid puudutava sisu eemaldamine:\r\nKui inimesest on Internetti pandud foto või video, mida ta seal näha ei soovi, võib ta nõuda, et see maha võetaks (Isikuandmete kaitse seaduse (IKS) § 11 lg 4).\r\n\r\nMahavõtmist võib nõuda inimene ise (IKS § 11 lg 4) või pöördudes Andmekaitse Inspektsiooni poole (IKS § 22). Kui on teada, kes pildi või video Internetti pani, saab nõude esitada isikuandmete töötlejale ehk veebilehe omanikule (IKS § 7 lg 1). Kui ei ole teada, kes lehekülje omanik on, aitab veebiteenuse pakkuja selle kindlaks teha (HMS § 38 lg 3).\r\n\r\nKui veebilehe omanik fotot maha ei võta, võib inimene pöörduda Andmekaitse Inspektsiooni poole ja veebilehe omaniku suhtes võib kohaldada sunniraha (IKS § 40 lg 2).";
		break;

		case "r2": // Tarbijate õigusi rikkuva või konkurenti halvustava sisu eemaldamine  
		content += "Tarbijate õigusi rikkuva või konkurenti halvustava sisu eemaldamine\r\nTarbija õiguste rikkumine võib tähendada näiteks eksitavat reklaami, mille mõni firma on oma kodulehele pannud (tarbijakaitseseadus (TKS) §121 lg 2).\r\n\r\nSel juhul võtab Tarbijakaitseamet ühendust firma endaga või teenusepakkujaga, kelle serveris koduleht asub (näiteks veebimajutus.ee) (TKS § 17 lg 2 p 1).\r\n\r\nKui firma sellest hoolimata eksitavat reklaami maha ei võta, jätkab tarbijakaitseamet asjaga tegelemist seni, kuni sisu muudetakse või eemaldatakse. Peale selle võib tarbijakaitseamet määrata firmale (või lisaks ka teenusepakkujale) trahvi (TKS § 471).";
		break;

		case "r3": // Karistusseadustikuga keelatud tegevused (vaenu õhutamine, identiteedivargus, lasteporno, sõjapropaganda, internetikelmused jne)  
		content += "Karistusseadustikuga keelatud tegevused (vaenu õhutamine, identiteedivargus, lasteporno, sõjapropaganda, internetikelmused jne)\r\nKui tegu on näiteks Internetis vaenu õhutamisega, on tegemist kuriteoga, mille eest näeb vastutuse ette karistusseadustik (KarS).\r\n\r\nSel juhul alustatakse lehekülje omaniku ja teenusepakkujale, kelle serveris koduleht asub, suhtes kriminaalmenetlust (kriminaalmenetluse seadustik (KrMS) § 6).\r\n\r\nKui isik mõistetakse süüdi, siis võib teda karistada rahalise karistuse või vangistusega.";
		break;

		case "r4": // Laimu, halvustava, privaatsust rikkuva või isikuõigusi riivava sisu eemaldamine
		content += "Laimu, halvustava, privaatsust rikkuva või isikuõigusi riivava sisu eemaldamine\r\nTeise inimese laimamine, au teotamine või isikuõiguste riivamine internetis ei ole kena, aga lisaks on see ka seadusevastane (VÕS § 1046 lg 1)!\r\n\r\n Isik saab ise saata laimajale nõude laim internetist maha võtta. Kui ta ei tea, kes laimu Interetti pani, saab ta pöörduda Andmekaitse Inspektsiooni, selgitamaks, kes on selle taga (HMS § 38 lg 3).\r\n\r\nKui laimavat sisu sellest hoolimata maha ei võeta, on inimesel õigus pöörduda kohtusse – ja nõuda sisu eemaldamist (TsMS § 3 lg 1). Õiguste rikkujalt võib nõuda kahjutasu (VÕS § 1043).";
		break;

		case "r5": // Sisu, mis rikub autoriõigusi 
		content += "Sisu, mis rikub autoriõigusi<br />Kui keegi on oma kodulehele ilma õiguseid omamata pannud üles muusikat, filme või arvutiprogramme (aga ka muud autoriõiguste alla kuuluvat materjali), siis on tegu intellektuaalomandi rikkumisega (autoriõiguse seadus (AutÕS) § 814).\r\n\r\n Sel juhul võtab kodulehe omanikuga või teenusepakkujaga, kelle serveris koduleht asub, ühendust kas autoriõiguste omanik ise või autoriõiguste kaitse organisatsioon ja nõuab sisu eemaldamist (AutÕS § 13 lg 1 p 2).<br /><br />Kui inimene sellest hoolimata filme, muusikat või muud autoriõigustega kaitstud sisu maha ei võta, võtab teenusepakkuja lehekülje maha (AutÕS § 13 lg 1 p 2, KarS § 223 lg 1). Kui teenusepakkuja lehekülge maha ei võta, siis on ka tema kaasvastutav.";
		break;
			
		default: 
		content += "";
		break;
	}
		
//Andmesubjektil on isikuandmete kaitse seaduse § 11 lõike 4 alusel õigus igal ajal nõuda isikuandmete töötlejalt isikuandmete töötlemise lõpetamist. 
//Kui Te viidatud andmeid ei eemalda, siis vastavalt isikuandmete kaitse seaduse § 22-le on andmesubjektil õigus pöörduda Andmekaitse Inspektsiooni poole, kellel on õigus veebilehe omaniku suhtes rakendada isikuandmete kaitse seaduse nõuete rikkumise eest sunniraha summas kuni 9600 eurot (isikuandmete kaitse seaduse § 40 lg 2). 

	content += "Palun lugege õiguslikku teavet rikkumise kohta aadressil:\r\nhttp://451.ee/juriidiline-analuus/\r\n\r\nSoovitame Teil andmete eemaldamisel mitte kasutada veakoodi error 404, vaid koodi 451 selgitusega “Seadus piirab ligipääsu” viitega lingile www.451.ee/sisu-eemaldamise-viisid/ \r\n\r\nHindame teie koostööd ja abi! Parimate soovidega!\r\nTeie 451";
		
	return content;
}


process.on('uncaughtException', function (exception) {
  console.log(exception);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
