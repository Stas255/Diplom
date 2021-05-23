/// <reference path="app/models/index.js" />
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { RSA, Keys } = require('./app/crypt/rsa');
const { Client } = require('./app/config/Client');
const app = express();

let client;
let rsa;
let Mainkeys;

const db = require("./app/models");
const Role = db.role;

db.sequelize.sync({ force: true }).then(() => {
	console.log('Drop and Resync Db');
	initial();
});

function initial() {
	Role.create({
		id: 1,
		name: "user"
	});

	Role.create({
		id: 2,
		name: "admin"
	});
}

var corsOptions = {
	origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

const io = require("socket.io-client");

rsa = new RSA(359, 257);
Mainkeys = rsa.createKey();

const socket = io.connect('http://localhost:7070',{query: {keys: JSON.stringify(Mainkeys)}});
socket.on('connect_error', function (err) {
	if (err == 'Invalid namespace') {
		console.error("Attempted to connect to invalid namespace");
	} else {
		console.error("Error on socket.io client", err.message);
	}
});

socket.on('connect', () => {
	client = new Client(null, 'http://localhost:7070');
	console.log('Connected');
});

socket.on('disconnect', function () {
	console.log('Disconnected');
	client = undefined;
	rsa = undefined;
	Mainkeys = undefined;
	rsa = new RSA(359, 257);
	Mainkeys = rsa.createKey();
});

socket.on('returnKeys', (data) => {
	let keys = new Keys(data);
	console.log(keys);
	client.SetKeys(keys);
});

app.get("/", (req, res) => {
	var u = {
		main:"dsdadad"
	};
	let text = rsa.Encription( JSON.stringify(u), client.keys);
	socket.emit('encrynt', text, function (response){
		console.log(response);
	});
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
});