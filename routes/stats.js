
/*
 * GET users listing.
 */

exports.list = function(req, res){
	//res.send("Aitäh, vorm on saadetud.");
	res.render('stats', { title: 'Express' });
};
/*
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};*/