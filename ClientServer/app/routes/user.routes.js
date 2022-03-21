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
		[authJwt.verifyToken, authJwt.isUser],
		controller.userBoard
	);

	app.post("/api/user/savepassword",
		[authJwt.verifyToken,
		authJwt.isUser,
		socketMain.isConnect,
		socketMain.savePassword],
		controller.savePassword
	);

	app.post("/api/user/getpassword",
		[authJwt.verifyToken,
		authJwt.isUser,
		socketMain.isConnect,
		controller.getfilesID],
		socketMain.getPassword
	);

	app.post("/api/user/getpasswords",
		[authJwt.verifyToken,
		authJwt.isUser],
		controller.getPasswords
	);

	app.post("/api/user/resetpassword",
		[authJwt.verifyToken,
		authJwt.isUser,
		controller.getfilesID,
		socketMain.isConnect,
		socketMain.resetPassword],
		controller.resetPasswords
	);

	app.post("/api/user/sendmessage",
		[authJwt.verifyToken,
		authJwt.isUser],
		controller.sendmessage
	);

	app.post(
		"/api/admin/getUsersMessages",
		[authJwt.verifyToken, authJwt.isAdmin],
		controller.getMessages
	);

	app.post(
		"/api/admin/deleteUsersMessages",
		[authJwt.verifyToken, authJwt.isAdmin],
		controller.deleteUsersMessages
	);

	app.post(
		"/api/admin/getAllBlockedUsers",
		[authJwt.verifyToken, authJwt.isAdmin],
		controller.getAllBlockedUsers
	);

	app.post(
		"/api/admin/cancelBlock",
		[authJwt.verifyToken, authJwt.isAdmin],
		controller.cancelBlock
	);

	app.post(
		"/api/admin/getUserNameById",
		[authJwt.verifyToken, authJwt.isAdmin],
		controller.getUserNameById
	);

	app.post(
		"/api/admin/getAllNamesSystemMessages",
		[authJwt.verifyToken, authJwt.isAdmin,
		socketMain.isConnect],
		socketMain.getAllMessageName
	);

	app.post(
		"/api/admin/getDetailsSystemMessages",
		[authJwt.verifyToken, authJwt.isAdmin,
		socketMain.isConnect],
		socketMain.getDetailsSystemMessages
	);

	app.post(
		"/api/admin/deleteSystemFileMessage",
		[authJwt.verifyToken, authJwt.isAdmin,
		socketMain.isConnect],
		socketMain.deleteSystemFileMessage
	);

	app.post(
		"/api/user/updateUser",
		[authJwt.verifyToken, authJwt.isUserForUpdate],
		controller.updateUser
	);

};