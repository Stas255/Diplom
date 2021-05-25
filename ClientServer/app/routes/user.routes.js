const { authJwt, socketMain } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
	app.use(function (req, res, next) {
		res.header(
			"Access-Control-Allow-Headers",
			"x-access-token, Origin, Content-Type, Accept"
		);
		next();
	});

	app.get("/api/test/all", controller.allAccess);

	app.get(
		"/api/test/user",
		[authJwt.verifyToken],
		controller.userBoard
	);

	app.post("/api/user/savepassword",
		[authJwt.verifyToken,
		socketMain.savePassword],
		controller.savePassword
	);

	app.post("/api/user/getpassword",
		[authJwt.verifyToken],
		socketMain.getPassword
	);

	app.post("/api/user/getpasswords",
		[authJwt.verifyToken],
		controller.getPasswords
	);

	app.get(
		"/api/test/admin",
		[authJwt.verifyToken, authJwt.isAdmin],
		controller.adminBoard
	);
};