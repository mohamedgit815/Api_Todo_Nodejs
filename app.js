require("dotenv").config({path:"config.env"});
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;
const ApiError = require("./Core/api_errors");


/// Routers
const todo = require("./Routes/todo_route");


app.use([
    express.json()
]);


app.use("/todo",todo);


app.all("*",(req,res)=>{
    res.status(500).json({
        message: new ApiError("Error",500)
    })
})


app.listen(port , ()=> {
    mongoose.connect(process.env.DB_LOCAL_URI).then((data)=>{
        console.log("DB True");
    }).catch((err)=>{
        console.log("DB False")
    });

    console.log("Running Server");
});
