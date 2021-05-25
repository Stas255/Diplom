var al = require("../Classes/Algoritm");
import FilePassword from "../models/FilePassword";

exports.CreatePass = function (idUser, namewebSite, password, callbackFn) {
    var hash = Math.random().toString(36).substring(2);
    FilePassword.findOne({ userId: idUser },
        function (err, doc) {
            var res = al.Encrypt(password, hash);
            console.log(res);
            var testRes = res.slice(0, 2) + res.slice(res.split('').length - 2, res.split('').length);
            res = res.slice(2, res.split('').length - 2);
            if (doc) {
                doc.webSites.push({
                    name: namewebSite,
                    hash: hash,
                    test: testRes
                });
                doc.save(function (err,result){
                    const id = result._id;
                    const pass = res;
                    var webRes = result.webSites.find(e => e.name == namewebSite);
                    const web = webRes._id;
                    callbackFn({id:id, password: pass, webId: web});
                });
            } else {
                const filePassword = new FilePassword();
                filePassword.userId = idUser;
                filePassword.webSites =[];
                filePassword.webSites.push({
                    name: namewebSite,
                    hash: hash,
                    test: testRes
                });
                filePassword.save(function (err,result){
                    const id = result._id;
                    const pass = res;
                    var webRes = result.webSites.find(e => e.name == namewebSite);
                    const web = webRes._id;
                    callbackFn({id:id, password: pass, webId: web});
                });
            }
        });
}

exports.GetPass = function (idUser,fileId, webSiteId, password, callbackFn) {
    FilePassword.findOne({ userId: idUser, _id: fileId },function (err, doc) {
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

/*exports.GetAllById = function (idUser, response) {
    const MongoClient = require("mongodb").MongoClient;
    const mongoClient =
        new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true, useUnifiedTopology: true });
    mongoClient.connect(function (err, client) {
        const db = client.db("usersdb");
        const collection = db.collection("users");
        collection.findOne({ id: idUser }, function (err, doc) {
            console.log(doc);
            if (doc) {
                var webSites = doc.webSites;
                webSites.forEach(function (part, index) {
                    this[index] = this[index].split('-').shift();
                }, webSites);
                console.log(webSites);
                response.send(webSites);
                return;
            }
            response.send(null);
        });

    });
}*/


