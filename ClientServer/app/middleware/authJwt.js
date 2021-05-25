const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

function verifyToken(req, res, next){
	let token = req.headers["x-access-token"];

	if (!token) {
		return res.status(403).send({
			message: "No token provided!"
		});
	}

	jwt.verify(token, config.secret, (err, decoded) => {
		if (err) {
			if(err.message == 'jwt expired'){
				return res.status(401).send("Time working token lost!");
			}
			return res.status(401).send("Unauthorized!");
		}
		req.userId = decoded.id;
		isUserExist(req, res, next);
	});
};

function isUserExist(req, res, next){
	User.findByPk(req.userId).then(user => {
		if(user){
			next();
			return;
		}else{
			res.status(400).send({
				message: "User not exist"
			});
		}
	})
}

function isAdmin(req, res, next){
	User.findByPk(req.userId).then(user => {
		user.getRoles().then(roles => {
			for (let i = 0; i < roles.length; i++) {
				if (roles[i].name === "admin") {
					next();
					return;
				}
			}

			res.status(403).send({
				message: "Require Admin Role!"
			});
			return;
		});
	});
};

function isUser(req, res, next){
	User.findByPk(req.userId).then(user => {
		user.getRoles().then(roles => {
			for (let i = 0; i < roles.length; i++) {
				if (roles[i].name === "user") {
					next();
					return;
				}
			}

			res.status(403).send("Require User Role!");
			return;
		});
	});
};

const authJwt = {
	verifyToken: verifyToken,
	isAdmin: isAdmin,
	isUser: isUser,
};
module.exports = authJwt;