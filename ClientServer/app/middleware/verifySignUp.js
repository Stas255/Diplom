const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

function checkDuplicateUsernameOrEmail(req, res, next){
	User.findOne({ 
		where: {
			username: req.body.username
		}
	}).then(user => {
		if (user) {
			res.status(400).send({
				message: "Не вдалося! Ім'я користувача вже використовується!"
			});
			return;
		} 

		User.findOne({
			where: {
				email: req.body.email
			}
		}).then(user => {
			if (user) {
				res.status(400).send({
					message: "Не вдалося! Електронна пошта вже використовується!"
				});
				return;
			}

			next();
		});
	});
};

function checkRolesExisted(req, res, next){
	if (req.body.roles) {
		for (let i = 0; i < req.body.roles.length; i++) {
			if (!ROLES.includes(req.body.roles[i])) {
				res.status(400).send({
					message: "Не вдалося! Роль не існує =" + req.body.roles[i]
				});
				return;
			}
		}
	}

	next();
};

const verifySignUp = {
	checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
	checkRolesExisted: checkRolesExisted
};

module.exports = verifySignUp;