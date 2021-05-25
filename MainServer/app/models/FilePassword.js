const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const filePassword = new Schema({
    userId:String,
    webSites:[{
        name: String,
        hash: String,
        test: String
    }]
});

const FilePassword = mongoose.model("FilePassword", filePassword);
export default FilePassword;