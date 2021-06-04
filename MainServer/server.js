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

var al = require("./app/Classes/Algoritm");
app.get('/', (req, res) => {
	var hash = Math.random().toString(36).substring(2);
	var result = al.Encrypt("pass", hash, [6, 9]);
	res.send(result);
});

const isValidJwt = (socket) => {
	const address = socket.handshake.address;
	if (address === '::ffff:127.0.0.1') {
		return true;
	} else {
		return false;
	}
};

const fs = require('fs');
process.on('uncaughtException', function (err) {
	if (err.code != 'ENOENT') {
		var d = new Date();

		var datestring = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + "-" + d.getHours() + "." + d.getMinutes() + "." + d.getSeconds() + "." + d.getMilliseconds();
		fs.writeFileSync(__dirname + "/app/storage/bugs/" + datestring + ".json", JSON.stringify(err, Object.getOwnPropertyNames(err)), { flag: 'w' }, function (err) {
		});
	}
});



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
		db.CreatePass(user, callbackFn);
	});

	socket.on('getUnicPassword', function (text, callbackFn) {
		let res = rsa.Dencription(text);
		let user = JSON.parse(res);
		db.GetPass(user, callbackFn, socket);
	});

	socket.on('resetUnicPassword', function (text, callbackFn) {
		let res = rsa.Dencription(text);
		let user = JSON.parse(res);
		db.ResetPass(user, callbackFn, socket);
	});

	socket.on('getAllMessageName', function (text, callbackFn) {
		var files = fs.readdirSync('./app/storage/bugs/');
		callbackFn(files);
	});

	socket.on('getDetailsSystemMessages', function (text, callbackFn) {
		let rawdata = fs.readFileSync('./app/storage/bugs/'+text);
		callbackFn(rawdata);
	});
	socket.on('deleteSystemFileMessage', function (text, callbackFn) {
		fs.unlink('./app/storage/bugs/'+text,function(err){
			if(err) callbackFn(err);
			callbackFn('file deleted successfully');
	   }); 
	});
});