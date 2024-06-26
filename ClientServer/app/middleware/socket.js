function savePasswordOnMainServer(req, res, next){
    var socket = req.io;
	var rsa = req.rsa;
	var client = req.client;
    var user = {
		id: req.userId,
		password: req.body.password
	};
	let text = rsa.Encription( JSON.stringify(user), client.keys);
	socket.emit('createUnicPassword', text, function (response){
		req.unicPassword = JSON.parse(rsa.Dencription(response));
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
		var result = JSON.parse(rsa.Dencription(response));
		res.send(result);
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
		req.unicPassword = JSON.parse(rsa.Dencription(response));
		if(req.unicPassword == 'Password not correct'){
			return res.status(404).send({ message: "Пароль не правильний." });
		}else{
			next();
		}
	
	});
}

function getAllMessageNameOnMainServer(req, res, next){
	var socket = req.io;
	socket.emit('getAllMessageName', null, function (response){
		res.send(response);
	});
}

function getDetailsSystemMessagesOnMainServer(req, res, next){
	var socket = req.io;
	const fileName = req.body.fileName
	socket.emit('getDetailsSystemMessages', fileName, function (response){
		res.send(response);
	});
}

function deleteSystemFileMessageOnMainServer(req, res, next){
	var socket = req.io;
	const fileName = req.body.fileName
	socket.emit('deleteSystemFileMessage', fileName, function (response){
		res.send(response);
	});
}

function isConnectOnMainServer(req, res, next){
	if(req.connectToMainServer){
		next();
	}else{
		return res.status(404).send({ message: "Помилка підключення до головного сервера" });
	}
}

const socketMain = {
	savePassword: savePasswordOnMainServer,
	getPassword: getPasswordOnMainServer,
	resetPassword: resetPasswordONMainServer,
	getAllMessageName: getAllMessageNameOnMainServer,
	getDetailsSystemMessages:getDetailsSystemMessagesOnMainServer,
	deleteSystemFileMessage:deleteSystemFileMessageOnMainServer,
	isConnect:isConnectOnMainServer
};

module.exports = socketMain;