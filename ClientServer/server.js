/// <reference path="app/models/index.js" />
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { RSA, Keys } = require('./app/crypt/rsa');
const { Client } = require('./app/config/Client');
var bcrypt = require("bcryptjs");
const app = express();

let client;
let rsa;
let Mainkeys;
let connectToMainServer = false; 
let NumberRe = 0;

const db = require("./app/models");
const Role = db.role;
const User = db.user;
const BlockedUser = db.blockedUser

db.sequelize.sync({ force: false }).then(() => {
	console.log('Drop and Resync Db');
	//initial();
});

function initial() {
	Role.create({
		id: 1,
		name: "user"
	});

	Role.create({
		id: 2,
		name: "admin"
	}).then(role => {
		User.create({
			username: "Admin",
			email: "admin@gmail.com",
			password: bcrypt.hashSync("adminadmin", 8)
		}).then(user => {
			user.setRoles([2]);
		});
	});
}

var corsOptions = {
	origin: "http://localhost:4200",
	optionsSuccessStatus: 200
};

const io = require("socket.io-client");

rsa = new RSA(173, 131);
Mainkeys = rsa.createKey();
var socket;
Connect();
function Connect() {
	NumberRe = 0;
	socket = io.connect(/*'http://t.tolstonozhenko.com.ua'*/ 'http://localhost:7070'
		, {
			'reconnection': true,
			'reconnectionDelay': 1000,
			'reconnectionDelayMax': 5000,
			'reconnectionAttempts': 5,
			query: { keys: JSON.stringify(Mainkeys) }
		});
	socket.on('connect_error', function (err) {
		NumberRe++;
		if (err == 'Invalid namespace') {
			console.error("Attempted to connect to invalid namespace");
		} else {
			console.error("Error on socket.io client", err.message);
			
		}
	});

	socket.on('connect', () => {
		client = new Client(null, /*'http://t.tolstonozhenko.com.ua'*/ 'http://localhost:7070');
	});

	socket.on('disconnect', function () {
		console.log('Disconnected');
		client = undefined;
		rsa = undefined;
		Mainkeys = undefined;
		connectToMainServer = false;
		rsa = new RSA(359, 257);
		Mainkeys = rsa.createKey();
	});
	socket.on('returnKeys', (data) => {
		NumberRe = 0;
		let keys = new Keys(data);
		connectToMainServer = true;
		console.log(keys);
		client.SetKeys(keys);
	});
	
	socket.on('blockUser', (data) => {
		console.log(data.idUser);
		User.findByPk(data.idUser).then(result => {
			BlockedUser.create({
				description: data.description,
				userId: data.idUser,
				userName: result.username
			});
		});
	});
}

app.use(function (req, res, next) {
	req.io = socket;
	req.rsa = rsa;
	req.client = client;
	req.connectToMainServer = connectToMainServer;
	res.type('application/json');
	next();
});

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/simple.routes')(app);
app.post('/getInfor', (req, res) => {
	res.send({ "mainServer": connectToMainServer });
	if(NumberRe >= 5 || !socket){
		Connect();
	}
});

process.on('uncaughtException', function (err) {
	if (err.code != 'ENOENT') {
		var d = new Date();

		var datestring = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + "-" + d.getHours() + "." + d.getMinutes() + "." + d.getSeconds() + "." + d.getMilliseconds();
		fs.writeFileSync(__dirname + "/app/storage/bugs/" + datestring + ".json", JSON.stringify(err, Object.getOwnPropertyNames(err)), { flag: 'w' }, function (err) {
		});
	}
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
});