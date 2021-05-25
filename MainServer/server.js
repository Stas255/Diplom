var app = require('express')();
var server = require('http').Server(app);
const { RSA, Keys } = require('./app/crypt/rsa');
const { Client } = require('./app/config/Client');
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/", { useUnifiedTopology: true, useNewUrlParser: true });

var db = require("./app/config/db");
server.listen(7070);

let client;
let rsa;

const isValidJwt = (socket) => {
	const address = socket.handshake.address;
	if (address === '::ffff:127.0.0.1') {
		return true;
	} else {
		return false;
	}
};

const io = require('socket.io')(server);

io.use((socket, next) => {
	if (isValidJwt(socket)) {

		return next();
	}
	next(new Error('authentication error'));
});

io.on('connection', (socket) => {
	if (client == undefined) {
		let clientKeys = new Keys(JSON.parse(socket.handshake.query.keys));
		console.log(clientKeys);
		client = new Client(socket.client.id, socket.request.connection.remoteAddress);
		client.SetKeys(clientKeys);
		console.log('connected:', socket.client.id);
		rsa = new RSA(191, 199);
		var keys = rsa.createKey();
		socket.emit('returnKeys', keys);
	}

	socket.on('disconnect', function () {
		if (client.CheckUser(socket.client.id, socket.request.connection.remoteAddress)) {
			client = undefined;
			rsa = undefined;
		}
		console.log(socket.request.connection.remoteAddress + ' has disconnected from the chat.' + socket.client.id);
	});

	socket.on('createUnicPassword', function (text, callbackFn) {
		let res = rsa.Dencription(text);
		let user = JSON.parse(res);
		db.CreatePass(user.id, user.password, callbackFn);
	});

	socket.on('getUnicPassword', function (text, callbackFn) {
		let res = rsa.Dencription(text);
		let user = JSON.parse(res);
		db.GetPass(user.id, user.fileId, user.webSiteId, user.password, callbackFn);
	});

	socket.on('resetUnicPassword', function (text, callbackFn) {
		let res = rsa.Dencription(text);
		let user = JSON.parse(res);
		db.ResetPass(user.id, user.fileId, user.webSiteId, user.password,user.passwordNew, callbackFn);
	});
});