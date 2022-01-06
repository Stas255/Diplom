const db = require("../models");
const config = require("../config/auth.config");
var bcrypt = require("bcryptjs");
const User = db.user;
const Password = db.password;
const Message = db.message;
const BlockedUser = db.blockedUser

exports.allAccess = (req, res) => {
	res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
	res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
	res.status(200).send("Admin Content.");
};

exports.resetPasswords = (req, res) => {
	Password.findByPk(req.body.passwordId).then(password => {
		if (!password) {
			return res.status(404).send({ message: "Пароль не знайдено." });
		}
		if (password.userId != req.userId) {
			return res.status(404).send({ message: "Ви не можете використовувати його" });
		}
		password.update({
			name: req.body.passwordName
		}).then(result => {
			if (req.body.passwordNew) {
				return res.send(req.unicPassword);
			}
			return res.send("changed");
		});
	});
};

exports.getfilesID = (req, res, next) => {
	Password.findByPk(req.body.passwordId).then(password => {
		if (!password) {
			return res.status(404).send({ message: "Пароль не знайдено." });
		}
		if (password.userId != req.userId) {
			return res.status(404).send({ message: "Ви не можете використовувати його" });
		}
		req.filesId = {
			fileId: password.file_password_id,
			webSiteId: password.web_site_id,
		};
		next();
		return;
	});
};

exports.getPasswords = (req, res) => {
	User.findByPk(req.userId).then(user => {
		if (!user) {
			return res.status(404).send({ message: "Користувач не знайдений." });
		}
		user.getPasswords().then(passwords => {
			let passwordsResult = [];
			if (passwords.length > 0) {
				for (let i = 0; i < passwords.length; i++) {
					passwordsResult.push({
						id: passwords[i].id,
						namePassword: passwords[i].name
					});
				}
				res.status(200).send(passwordsResult);
			} else {
				res.status(200).send(passwordsResult);
			}
		});
	});
};

exports.savePassword = (req, res) => {
	User.findByPk(req.userId).then(user => {
		if (!user) {
			return res.status(404).send({ message: "Користувач не знайдений." });
		}
		user.createPassword({
			name: req.body.name,
			file_password_id: req.unicPassword.id,
			web_site_id: req.unicPassword.webId
		}).then(result => {
			res.send(req.unicPassword.password);
		}).catch(err => {
			console.log(err)
		});
	});
};

exports.sendmessage = (req, res) => {
	User.findByPk(req.userId).then(user => {
		if (!user) {
			return res.status(404).send({ message: "Користувач не знайдений." });
		}
		user.createMessage({
			name: req.body.name,
			userName: user.username,
			description: req.body.description
		}).then(result => {
			res.send("Повідомлення надіслано");
		}).catch(err => {
			console.log(err)
		});
	});
};

exports.getMessages = (req, res) => {
	Message.findAll().then(messages => {
		let messagesResult = [];
		if (messages.length > 0) {
			for (let i = 0; i < messages.length; i++) {
				messagesResult.push({
					id: messages[i].id,
					name: messages[i].name,
					userName: messages[i].userName,
					description: messages[i].description
				});
			}
			res.send(messagesResult);
		} else {
			res.status(200).send(messagesResult);
		}
	});
};

exports.deleteUsersMessages = (req, res) => {
	Message.destroy({
		where: {
			id: req.body.messageId
		}
	}).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
		if (rowDeleted === 1) {
			res.send('Видалено успішно');
		}
	}, function (err) {
		cres.send(err);
	});
};

exports.cancelBlock = (req, res) => {
	BlockedUser.destroy({
		where: {
			userId: req.body.userId
		}
	}).then(result => {
		res.status(200).send("Розблоковано");
	});
};


exports.getAllBlockedUsers = (req, res) => {
	BlockedUser.findAll().then(blockedUsers => {
		let blockedUsersResult = [];
		if (blockedUsers.length > 0) {
			for (let i = 0; i < blockedUsers.length; i++) {
				blockedUsersResult.push({
					id: blockedUsers[i].id,
					userId: blockedUsers[i].userId,
					userName: blockedUsers[i].userName,
					description: blockedUsers[i].description
				});
			}
			res.send(blockedUsersResult);
		} else {
			res.status(200).send(blockedUsersResult);
		}
	});
};

exports.getUserNameById = (req, res) => {
	User.findByPk(req.userId).then(user => {
		res.send(user.username);
	});
};

exports.updateUser = (req, res) => {
	User.findByPk(req.userId).then(user => {
		user.update({
			password: bcrypt.hashSync(req.body.newPassword, 8)
		}).then(user => {
			res.status(200).send("Зміни збережено");
		});
	});
};

