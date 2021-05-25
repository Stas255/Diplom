const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Password = db.password;

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
			return res.status(404).send({ message: "Password Not found." });
		}
		if (password.userId != req.userId) {
			return res.status(404).send({ message: "You cannot using it" });
		}
		password.update({
			name: req.body.passwordName
		}).then(result => {
			if(req.body.passwordNew){
				return res.send(req.unicPassword);
			}
			return res.send("changed");
		});
	});
};

exports.getfilesID  = (req, res, next) => {
	Password.findByPk(req.body.passwordId).then(password => {
		if (!password) {
			return res.status(404).send({ message: "Password Not found." });
		}
		if (password.userId != req.userId) {
			return res.status(404).send({ message: "You cannot using it" });
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
			return res.status(404).send({ message: "User Not found." });
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
				res.send(passwordsResult);
			} else {
				res.status(200).send(passwordsResult);
			}
		});
	});
};

exports.savePassword = (req, res) => {
	User.findByPk(req.userId).then(user => {
		if (!user) {
			return res.status(404).send({ message: "User Not found." });
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
