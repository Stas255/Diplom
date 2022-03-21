var al = require("../Classes/Algoritm");
//const FilePassword = require("../models/FilePassword");
const { DB, FindNullError, UserTable, WebSite } = require("../My_db_plugin/JSON_db");
var db = new DB('./app/storage/db/');

var Storage = require('node-storage');
var userBlock = new Storage('./app/storage/user.json');

exports.CreatePass = function (user, callbackFn, Encription, clientKeys) {
    var hash = Math.random().toString(36).substring(2);
    var numbers = Array.from({ length: 2 }, () => Math.floor(Math.random() * 9) + 3);

    db.findOneUserByIdOrNull({ userId: user.id }).then((userTB) => {
        var res = al.Encrypt(user.password, hash, numbers);
        console.log(res);
        var testRes = res.slice(0, 2) + res.slice(res.split('').length - 2, res.split('').length);
        res = res.slice(2, res.split('').length - 2);
        if (userTB != null) {
            let newWeb = new WebSite({
                hash: hash,
                test: testRes,
                numbers: numbers
            });
            userTB.addNewWebSite(newWeb);
            userTB.save().then((result) => {
                const id = result.fileUser.id_user;
                const password = res;
                const webId = newWeb.id;
                callbackFn(Encription({ id: id, password: password, webId: webId }, clientKeys));
            }).catch(err => {
                console.log(err);
            });;
        } else {
            db.createNewUserTable(user.id).then((newUserTB) => {
                let newWeb2 = new WebSite({
                    hash: hash,
                    test: testRes,
                    numbers: numbers
                });
                newUserTB.addNewWebSite(newWeb2);
                newUserTB.save().then((result) => {
                    const id = result.fileUser.id_user;
                    const password = res;
                    const webId = newWeb2.id;
                    callbackFn(Encription({ id: id, password: password, webId: webId }, clientKeys));
                }).catch(err => {
                    console.log(err);
                });
            });
        }
    }).catch(err => {
        if (err instanceof FindNullError) {
            console.log(err);
            return;
        }
        console.log(err);
    });
    /*
    FilePassword.findOne({ userId: user.id },
        function (err, doc) {
            var res = al.Encrypt( user.password, hash, numbers);
            console.log(res);
            var testRes = res.slice(0, 2) + res.slice(res.split('').length - 2, res.split('').length);
            res = res.slice(2, res.split('').length - 2);
            if (doc) {
                doc.webSites.push({
                    hash: hash,
                    test: testRes,
                    numbers: numbers
                });
                doc.save(function (err, result) {
                    const id = result._id;
                    const pass = res;
                    var webRes = result.webSites.find(e => e.hash == hash);
                    const web = webRes._id;
                    callbackFn(Encription({ id: id, password: pass, webId: web }, clientKeys));
                });
            } else {
                const filePassword = new FilePassword();
                filePassword.userId = user.id;
                filePassword.webSites = [];
                filePassword.webSites.push({
                    hash: hash,
                    test: testRes,
                    numbers: numbers
                });
                filePassword.save(function (err, result) {
                    const id = result._id;
                    const pass = res;
                    var webRes = result.webSites.find(e => e.hash == hash);
                    const web = webRes._id;
                    callbackFn(Encription({ id: id, password: pass, webId: web }, clientKeys));
                });
            }
        });*/
}

exports.GetPass = function (user, callbackFn, socket, Encription, clientKeys) {
    db.findOneWebById({ userId: user.id, web_id: user.webSiteId }).then((webTB) => {
        var webRes = webTB;
        var hash = webRes.hash;
        var numbers = webRes.numbers;
        var res = al.Encrypt(user.password, hash, numbers);
        var testRes = res.slice(0, 2) + res.slice(res.length - 2, res.split('').length);
        CheckPassword(testRes, webRes.test, user.id, socket);
        res = res.slice(2, res.length - 2);
        callbackFn(Encription(res, clientKeys));
    }).catch(err => {
        if (err instanceof FindNullError) {
            console.log(err);
            return;
        }
        console.log(err);
    });

    /*
        FilePassword.findOne({ userId: user.id, _id: user.fileId }, function (err, doc) {
            var webSites = doc.webSites;
            var webRes = webSites.find(e => e._id == user.webSiteId);
            var hash = webRes.hash;
            var numbers = webRes.numbers;
            var res = al.Encrypt(user.password, hash, numbers);
            var testRes = res.slice(0, 2) + res.slice(res.length - 2, res.split('').length);
            CheckPassword(testRes, webRes.test, user.id, socket);
            res = res.slice(2, res.length - 2);
            callbackFn(Encription(res, clientKeys));
        });*/
}


function CheckPassword(testfrombd, test, idUser, socket) {
    let user = userBlock.get(idUser);
    if (testfrombd == test) {
        if (user && user.incorrectPaswordCount != 0) {
            user.incorrectPaswordCount = 0;
        }
        return true;
    } else {
        if (!user) {
            userBlock.put(idUser, { incorrectPaswordCount: 1 });
        } else {
            if (user.incorrectPaswordCount > 3) {
                socket.emit('blockUser', { idUser: idUser, description: "Too many incorrect password" });
            }
            user.incorrectPaswordCount++;
        }
        return false;
    }
}

exports.ResetPass = function (user, callbackFn, socket, Encription, clientKeys) {
    db.findOneUserById({ userId: user.id}).then((userTB) => {
        var webSites = userTB.webSites;
            var webRes = webSites.find(e => e.id == user.webSiteId);
        var hash = webRes.hash;
        var numbers = webRes.numbers;
        var res = al.Encrypt(user.password, hash, numbers);
        var testRes = res.slice(0, 2) + res.slice(res.length - 2, res.split('').length);
        if (CheckPassword(testRes, webRes.test, user.id, socket)) {
            var hashNew = Math.random().toString(36).substring(2);
            var numbersNew = Array.from({ length: 2 }, () => Math.floor(Math.random() * 9) + 3);
            var resNew = al.Encrypt(user.passwordNew, hashNew, numbersNew);
            var testResNew = resNew.slice(0, 2) + resNew.slice(resNew.length - 2, resNew.split('').length);
            webRes.hash = hashNew;
            webRes.test = testResNew;
            webRes.numbers = numbersNew;
            userTB.save().then(result => {
                resNew = resNew.slice(2, resNew.length - 2);
                callbackFn(Encription(resNew, clientKeys))
            }).catch((err) => {
                callbackFn(Encription(err, clientKeys));
            });
        } else {
            callbackFn(Encription("Password not correct", clientKeys));
        }
    });
    /*
        FilePassword.findOne({ userId: user.id, _id: user.fileId }, function (err, doc) {
            var webSites = doc.webSites;
            var webRes = webSites.find(e => e._id == user.webSiteId);
            var hash = webRes.hash;
            var numbers = webRes.numbers;
            var res = al.Encrypt(user.password, hash, numbers);
            var testRes = res.slice(0, 2) + res.slice(res.length - 2, res.split('').length);
            if (CheckPassword(testRes, webRes.test, user.id, socket)) {
                var hashNew = Math.random().toString(36).substring(2);
                var numbersNew = Array.from({ length: 2 }, () => Math.floor(Math.random() * 9) + 3);
                var resNew = al.Encrypt(user.passwordNew, hashNew, numbersNew);
                var testResNew = resNew.slice(0, 2) + resNew.slice(resNew.length - 2, resNew.split('').length);
                webRes.hash = hashNew;
                webRes.test = testResNew;
                webRes.numbers = numbersNew;
                doc.save().then(result => {
                    resNew = resNew.slice(2, resNew.length - 2);
                    callbackFn(Encription(resNew, clientKeys))
                }).catch((err) => {
                    callbackFn(Encription(err, clientKeys));
                });
            } else {
                callbackFn(Encription("Password not correct", clientKeys));
            }
        });*/
}
