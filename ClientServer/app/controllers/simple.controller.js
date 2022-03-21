const algoritm = require("../crypt/js/Algoritm");
const toWords = require("../crypt/js/toWords");
const zxcvbn = require("../crypt/js/zxcvbn");

exports.getUnicPassword = (req, res) => {
	var password = req.body.password;
    var uniqPassword = algoritm.Encrypt(password);
    var test = zxcvbn.zxcvbn(uniqPassword);
    var aboutPassword = toWords.toWords(test.crack_time);
    res.send({
        uniqPassword: uniqPassword,
        aboutPassword:aboutPassword
    });
};

