const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const filePassword = new Schema({
    userId:String,
    webSites:[{
        hash: String,
        test: String,
        numbers: [Number]
    }]
});

const FilePassword = mongoose.model("FilePassword", filePassword);
module.exports = FilePassword; 