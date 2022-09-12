const mongoose = require("mongoose");

const _constName = {
    type: String , 
    minlength: [2 , "Too short Category Name"] ,
    maxlength: [32 , "Too long Category Name"] ,
    unique: [true , "Must be Uniqe"]
}

const schema = mongoose.Schema({
    name: _constName , 
    body: _constName ,
    
    slug: {
        type: String , 
        lowercase: true
    }
},{timestap:true});

module.exports = mongoose.model("todo",schema);