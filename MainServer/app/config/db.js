var al = require("../Classes/Algoritm");
import FilePassword from "../models/FilePassword";

exports.CreatePass = function (idUser, password, callbackFn) {
    var hash = Math.random().toString(36).substring(2);
    FilePassword.findOne({ userId: idUser },
        function (err, doc) {
            var res = al.Encrypt(password, hash);
            console.log(res);
            var testRes = res.slice(0, 2) + res.slice(res.split('').length - 2, res.split('').length);
            res = res.slice(2, res.split('').length - 2);
            if (doc) {
                doc.webSites.push({
                    hash: hash,
                    test: testRes
                });
                doc.save(function (err, result) {
                    const id = result._id;
                    const pass = res;
                    var webRes = result.webSites.find(e => e.hash == hash);
                    const web = webRes._id;
                    callbackFn({ id: id, password: pass, webId: web });
                });
            } else {
                const filePassword = new FilePassword();
                filePassword.userId = idUser;
                filePassword.webSites = [];
                filePassword.webSites.push({
                    hash: hash,
                    test: testRes
                });
                filePassword.save(function (err, result) {
                    const id = result._id;
                    const pass = res;
                    var webRes = result.webSites.find(e => e.hash == hash);
                    const web = webRes._id;
                    callbackFn({ id: id, password: pass, webId: web });
                });
            }
        });
}

exports.GetPass = function (idUser, fileId, webSiteId, password, callbackFn) {
    FilePassword.findOne({ userId: idUser, _id: fileId }, function (err, doc) {
        var webSites = doc.webSites;
        var webRes = webSites.find(e => e._id == webSiteId);
        var hash = webRes.hash;
        var res = al.Encrypt(password, hash);
        var testRes = res.slice(0, 2) + res.slice(res.length - 2, res.split('').length);
        console.log(testRes == webRes.test);
        res = res.slice(2, res.length - 2);
        callbackFn(res);
    });
}

const CheckPassword = function (idUser, fileId, webSiteId, password) {
    return new Promise((resolve, reject) => {
        FilePassword.findOne({ userId: idUser, _id: fileId }, function (err, doc) {
            var webSites = doc.webSites;
            var webRes = webSites.find(e => e._id == webSiteId);
            var hash = webRes.hash;
            var res = al.Encrypt(password, hash);
            var testRes = res.slice(0, 2) + res.slice(res.length - 2, res.split('').length);
            if (testRes == webRes.test) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });

}

exports.ResetPass = function (idUser, fileId, webSiteId, password, passwordNew, callbackFn) {
    FilePassword.findOne({ userId: idUser, _id: fileId }, function (err, doc) {
        var webSites = doc.webSites;
        var webRes = webSites.find(e => e._id == webSiteId);
        var hash = webRes.hash;
        var res = al.Encrypt(password, hash);
        var testRes = res.slice(0, 2) + res.slice(res.length - 2, res.split('').length);
        if (testRes == webRes.test) {
            var hashNew = Math.random().toString(36).substring(2);
            var resNew = al.Encrypt(passwordNew, hashNew);
            var testResNew = resNew.slice(0, 2) + resNew.slice(resNew.length - 2, resNew.split('').length);
            webRes.hash = hashNew;
            webRes.test = testResNew;
            doc.save().then(result => {
                resNew = resNew.slice(2, resNew.length - 2);
                callbackFn(resNew)
            }).catch((err) => {
                callbackFn(err);
            });
        } else {
            callbackFn("err");
        }
    });
}


