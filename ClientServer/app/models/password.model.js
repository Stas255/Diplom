module.exports = (sequelize, Sequelize) => {
	const Password = sequelize.define("passwords", {
		id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV1,
			primaryKey: true
		},
		name: {
			type: Sequelize.STRING
		},
		file_password_id: {
			type: Sequelize.STRING
		},
		web_site_id: {
			type: Sequelize.STRING
		}
	});

	return Password;
};