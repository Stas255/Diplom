const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;

exports.allAccess = (req, res) => {
	res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
	res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
	res.status(200).send("Admin Content.");
};

/*exports.getPassword = (req, res, next) => {
	User.findByPk(req.userId).then(user => {
		if (!user) {
			return res.status(404).send({ message: "User Not found." });
		}
		user.getPasswords().then(passwords => {
			if (passwords.length > 0) {
				for (let i = 0; i < passwords.length; i++) {
					if(passwords[i].name == req.body.name){
						req.simplePassword = {
							name: passwords[i].name,
							fileId: passwords[i].file_password_id
						};
						next();
						return;
					}
				}
			} else {
				res.send("You dont have password");
			}
		});
	});
};*/

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
						namePassword: passwords[i].name,
						fileId: passwords[i].file_password_id,
						webId: passwords[i].web_site_id
					});
					res.send(passwordsResult);
				}
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
