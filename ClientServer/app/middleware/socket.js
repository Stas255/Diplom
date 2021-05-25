function savePasswordOnMainServer(req, res, next){
    var socket = req.io;
	var rsa = req.rsa;client
	var client = req.client;
    var user = {
		id: req.userId,
		password: req.body.password,
		namewebSite: req.body.name
	};
	let text = rsa.Encription( JSON.stringify(user), client.keys);
	socket.emit('createUnicPassword', text, function (response){
		req.unicPassword = response;
		next();
	});
};

function getPasswordOnMainServer(req, res){
    var socket = req.io;
	var rsa = req.rsa;client
	var client = req.client;
    var user = {
		id: req.userId,
		password: req.body.password,
		webSiteId: req.body.webSiteId,
		fileId: req.body.fileId
	};
	let text = rsa.Encription( JSON.stringify(user), client.keys);
	socket.emit('getUnicPassword', text, function (response){
		res.send(response);
	});
};


const socketMain = {
	savePassword: savePasswordOnMainServer,
	getPassword: getPasswordOnMainServer
};

module.exports = socketMain;