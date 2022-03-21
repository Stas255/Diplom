const controller = require("../controllers/qrcode.controller");


module.exports = function (app) {
	app.use(function (req, res, next) {
		res.header(
			"Access-Control-Allow-Headers",
			"x-access-token, Origin, Content-Type, Accept"
		);
		next();
	});

	app.post("/qr/setResponse", controller.setResponse);
	app.post("/qr/returnResponse", controller.returnResponse);
};