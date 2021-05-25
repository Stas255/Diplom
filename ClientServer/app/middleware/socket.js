function savePasswordOnMainServer(req, res, next){
    var socket = req.io;
	var rsa = req.rsa;client
	var client = req.client;
    var user = {
		id: req.userId,
		password: req.body.password
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
		webSiteId: req.filesId.webSiteId,
		fileId: req.filesId.fileId
	};
	let text = rsa.Encription( JSON.stringify(user), client.keys);
	socket.emit('getUnicPassword', text, function (response){
		res.send(response);
	});
};

function resetPasswordONMainServer(req, res, next){
	if(!req.body.passwordNew){
		next();
		return;
	}
	var socket = req.io;
	var rsa = req.rsa;client
	var client = req.client;
	var user = {
		id: req.userId,
		password: req.body.password,
		passwordNew: req.body.passwordNew,
		webSiteId: req.filesId.webSiteId,
		fileId: req.filesId.fileId
	}
	let text = rsa.Encription( JSON.stringify(user), client.keys);
	socket.emit('resetUnicPassword', text, function (response){
		req.unicPassword = response;
		next();
	});
}


const socketMain = {
	savePassword: savePasswordOnMainServer,
	getPassword: getPasswordOnMainServer,
	resetPassword: resetPasswordONMainServer
};

module.exports = socketMain;