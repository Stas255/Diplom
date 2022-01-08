const fs = require('fs');
const uuid = require("uuid");
class FolderDB {
    path;
    folderFind = false;
    constructor(path) {
        if (this.checkPath(path)) {
            this.path = path;
            this.folderFind = true;
            console.log("Connect to folder " + path);
        } else {
            throw new Error('Cannot find folder "' + path + '"');
        }

    }

    getPath() {
        return this.path;
    }

    setPath(path) {
        if (this.checkPath(path)) {
            this.path = path;
        }
    }

    checkPath(path) {
        if (fs.existsSync(path)) {
            return true;
        }
        return false;
    }

}

class userInfor {
    idUser;

    constructor(idUser) {
        this.idUser = idUser;
    }

    isUserFileExists(path) {
        if (fs.existsSync(path + this.idUser + ".json")) {
            return true;
        }
        return false;
    }

    getIdUser() {
        return this.idUser;
    }

}

class Filter {
    userId;
    web_id;
    constructor(obj) {
        if (this.checkProperties(obj)) {
            obj && Object.assign(this, obj);
        } else {
            throw new Error('Cannot conver object');
        }

    }

    checkProperties(obj) {
        var listFilter = Object.getOwnPropertyNames(this);
        var listObj = Object.getOwnPropertyNames(obj);
        let checker = (arr, target) => target.every(v => arr.includes(v));
        return checker(listFilter, listObj);
    }

    toString() {
        return " userId: " + this.userId + " web_id: " + this.web_id;
    }
}

class FileUser {
    path;
    id_user;
    constructor(path,id_user) {
        this.path = path + id_user;
        this.id_user = id_user;
    }

    openFile() {
        let data = fs.readFileSync(this.path + ".json");
        return data;
    }

    saveFile(userTable) {
        if (userTable instanceof UserTable) {
            let file = this.convertUserTableToJson(userTable);
            fs.writeFileSync(userTable.fileUser.path + ".json", JSON.stringify(file));
        } else {
            throw new Error('userTable not instanceof UserTable');
        }
    }

    convertUserTableToJson(userTable) {
        if (userTable instanceof UserTable) {
            let res = [];
            let websites = userTable.webSites;
            res.push({ webSites: websites });
            return res;
        } else {
            throw new Error('userTable not instanceof UserTable');
        }
    }

    createFile(){
        if (fs.existsSync(this.path + this.idUser + ".json")) {
            throw new Error('Cannot create. File exsist');
        }
        fs.writeFileSync(this.path + ".json", "[{\"webSites\": [ ]}]");
    }

}

class WebSite {
    numbers;
    id;
    hash;
    test;

    constructor(obj) {
        if (this.checkProperties(obj)) {
            obj && Object.assign(this, obj);
            //this.numbers = Object.values(this.numbers).map((val) => new Number(val));
        } else {
            throw new Error('Cannot conver object to UserTable');
        }

    }

    checkProperties(obj) {
        var listFilter = Object.getOwnPropertyNames(this);
        var listObj = Object.getOwnPropertyNames(obj);
        let checker = (arr, target) => target.every(v => arr.includes(v));
        return checker(listFilter, listObj);
    }

    createId(){
        this.id = uuid.v4();
    }

}

class UserTable {
    fileUser;
    webSites; //array class WebSite

    constructor(obj, fileUser) {
        if (fileUser instanceof FileUser) {
            this.fileUser = fileUser;
        } else {
            throw new Error('fileUser not instanceof FileUser');
        }
        if(obj == null){
            this.webSites = [];
            return;
        }
        if ( this.checkProperties(obj)) {
            obj && Object.assign(this, obj);
            this.webSites = Object.values(this.webSites).map((val) => new WebSite(val));
        } else {
            throw new Error('Cannot conver object to UserTable');
        }

    }

    checkProperties(obj) {
        var listFilter = Object.getOwnPropertyNames(this);
        var listObj = Object.getOwnPropertyNames(obj);
        let checker = (arr, target) => target.every(v => arr.includes(v));
        return checker(listFilter, listObj);
    }

    getOne(filter) {
        if (filter instanceof Filter) {
            webSites.forEach(element => {
                if (element.id == filter.web_id) {
                    return element;
                }
            });
            throw new FindNullError('Cannot find webSite with id' + filter.toString());
        } else {
            throw new Error('filter is not class Filter');
        }
    }

    addNewWebSite(webSite) {
        if (webSite instanceof WebSite) {
            webSite.createId();
            this.webSites.push(webSite);
        } else {
            throw new Error('webSite not instanceof WebSite');
        }
    }

    async save() {
        this.fileUser.saveFile(this);
        return this;
    }
}

class FindNullError extends Error {
    constructor(message) {
        super(message);
        this.name = "FindNullError";
    }
}

class FindMoreThanOneError extends Error {
    constructor(message) {
        super(message);
        this.name = "FindMoreThanOneError";
    }
}



class Request {
    objJSON;
    userI;

    constructor(objJSON, userI) {
        if (userI instanceof userInfor) {
            this.userI = userI;
        } else {
            new Error("userI not instanceof userInfor");
        }
        this.objJSON = objJSON;
    }

    convertJsonToArrayUserTable(fileUser,) {
        if (fileUser instanceof FileUser) {
            this.fileUser = fileUser;
        } else {
            throw new Error('fileUser not instanceof FileUser');
        }
        var arr = JSON.parse(this.objJSON);
        let ar = Object.values(arr).map((val) => new UserTable(val, fileUser))
        return ar;
    }

    static findWebsById(f, arrWebSitesTable) {
        let result = [];
        if (f instanceof Filter) {
            arrWebSitesTable.forEach(element => {
                if (element instanceof WebSite) {
                    if (element.id == f.web_id) {
                        result.push(element);
                    }
                } else {
                    new Error("element not instanceof WebSite");
                }
            });
            return result;
        } else {
            new Error("f not instanceof Filter");
        }
    }

}

class DB {
    fileDb;

    constructor(path) {
        try {
            this.fileDb = new FolderDB(path);
        } catch (e) {
            console.log(e);
        }
    }

    async findOneWebById(f) {
        let filter = new Filter(f);
        let userI = new userInfor(filter.userId);
        if (userI.isUserFileExists(this.fileDb.getPath())) {
            var fileUser = new FileUser(this.fileDb.getPath(), userI.getIdUser());
            var jsonB = new Request(fileUser.openFile(), userI);
            var userTables = jsonB.convertJsonToArrayUserTable(fileUser);
            checkIsOneElement(userTables, UserTable.name, filter);
            var result = Request.findWebsById(filter, userTables[0].webSites);
            checkIsOneElement(result, WebSite.name, filter);
            return result[0];
        } else {
            throw new FindNullError('Cannot user file with id "' + userI.getIdUser() + '"');
        }
    }

    async findOneUserById(f) {
        let filter = new Filter(f);
        let userI = new userInfor(filter.userId);
        if (userI.isUserFileExists(this.fileDb.getPath())) {
            var fileUser = new FileUser(this.fileDb.getPath(), userI.getIdUser());
            var jsonB = new Request(fileUser.openFile(), userI);
            var userTables = jsonB.convertJsonToArrayUserTable(fileUser);
            checkIsOneElement(userTables, UserTable.name, filter);
            return userTables[0];
        } else {
            throw new FindNullError('Cannot user file with id "' + userI.getIdUser() + '"');
        }
    }

    async findOneUserByIdOrNull(f){
        let filter = new Filter(f);
        let userI = new userInfor(filter.userId);
        if (userI.isUserFileExists(this.fileDb.getPath())) {
            var fileUser = new FileUser(this.fileDb.getPath(), userI.getIdUser());
            var jsonB = new Request(fileUser.openFile(), userI);
            var userTables = jsonB.convertJsonToArrayUserTable(fileUser);
            checkIsOneElement(userTables, UserTable.name, filter);
            return userTables[0];
        } else {
            return null;
        }
    }

    async createNewUserTable(user_id){
        let userI = new userInfor(user_id);
        if(!userI.isUserFileExists()){
            var fileUser = new FileUser(this.fileDb.getPath(), userI.getIdUser());
            fileUser.createFile();
            var userTable = new UserTable(null,fileUser);
            return userTable;
        }
    }
}

function checkIsOneElement(arr, classname, filter) {
    if (arr.length == 1) {
        return;
    } else if (arr.length > 1) {
        throw new FindMoreThanOneError('We find more than one in ' + classname + ' when use filter "' + filter.toString() + '"');
    } else if (arr.length == 0) {
        throw new FindNullError('We find zero information in ' + classname + ' when use filter "' + filter.toString() + '"');
    }
}

module.exports = {
    DB: DB,
    FindNullError: FindNullError,
    UserTable: UserTable,
    WebSite, WebSite
}