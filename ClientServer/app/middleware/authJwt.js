const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const BlockedUser = db.blockedUser;
var bcrypt = require("bcryptjs");

function verifyToken(req, res, next) {
	let token = req.headers["x-access-token"];

	if (!token) {
		return res.status(403).send({
			message: "No token provided!"
		});
	}

	jwt.verify(token, config.secret, (err, decoded) => {
		if (err) {
			if (err.message == 'jwt expired') {
				return res.status(401).send({
					message: "Time working token lost!"
				});
			}
			return res.status(401).send({
				message: "Unauthorized"
			});
		}
		req.userId = decoded.id;
		isUserExist(req, res, next);
	});
};

function isUserExist(req, res, next) {
	User.findByPk(req.userId).then(user => {
		if (user) {
			next();
			return;
		} else {
			res.status(400).send({
				message: "User not exist"
			});
		}
	})
}

function isAdmin(req, res, next) {
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

function isUser(req, res, next) {
	User.findByPk(req.userId).then(user => {
		user.getRoles().then(roles => {
			for (let i = 0; i < roles.length; i++) {
				let isUser = false;
				if (roles[i].name === "user") {
					isUser = true;
					let test = user.getBlockedUser().then(blocked => {
						if (!blocked) {
							next();
							return;
						} else {
							var description = 'Вас заблокували через ' + blocked.description + '\n Ви можете відправити лише одне повідомлення\n' + (blocked.sentMessage ? 'Ви вже надіслали' : '');
							if (res.req.originalUrl == "/api/user/sendmessage") {
								if (!blocked.sentMessage) {
									blocked.update({
										sentMessage: 1
									}).then(result => {
										next();
										return;
									});
								} else {
									res.status(403).send({
										message: description
									});
									return;
								}
							} else {
								res.status(403).send({
									message: description
								});
								return;
							}
						}
					});

				}
			}
			if (!isUser) {
				res.status(403).send("Потрібна роль користувача!");
				return;
			}
		});
	});
};

function isBlocked(req, res, next) {
	User.findByPk(req.userId).then(user => {
		user.getRoles().then(roles => {
			for (let i = 0; i < roles.length; i++) {
				if (roles[i].name === "user") {
					let test = user.getBlockedUser();
					next();
					return;
				}
			}

			res.status(403).send("Потрібна роль користувача!");
			return;
		});
	});
};

function isUserForUpdate(req, res, next) {
	User.findByPk(req.userId).then(user => {
		if(!user){
			res.status(404).send("Користувача не знайдено");
		return;
		}
		var passwordIsValid = bcrypt.compareSync(
			req.body.oldPassword,
			user.password
		);
		if (user.email == req.body.email && passwordIsValid) {
			next();
			return;
		}
		res.status(404).send("Дані невірні");
		return;
	});
};

const authJwt = {
	verifyToken: verifyToken,
	isAdmin: isAdmin,
	isUser: isUser,
	isBlocked: isBlocked,
	isUserForUpdate: isUserForUpdate
};
module.exports = authJwt;