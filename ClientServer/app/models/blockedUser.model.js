module.exports = (sequelize, Sequelize) => {
	const Password = sequelize.define("blockedUser", {
		id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV1,
			primaryKey: true
		},
		description: {
			type: Sequelize.TEXT
		},
		userName: {
			type: Sequelize.STRING
		}
	});

	return Password;
};