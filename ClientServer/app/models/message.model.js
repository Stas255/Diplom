module.exports = (sequelize, Sequelize) => {
	const Password = sequelize.define("message", {
		id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV1,
			primaryKey: true
		},
		name: {
			type: Sequelize.STRING
		},
		userName: {
			type: Sequelize.STRING
		},
		description: {
			type: Sequelize.TEXT
		}
	});

	return Password;
};