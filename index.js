const express = require('express')

require('dotenv').config();

const Task = require("./models/task.model")

const database = require("./config/database")
database.connect();

const app = express();
const port = process.env.PORT;

app.get("/tasks",async (req,res)=>{
    const tasks = await Task.find({
        deleted:false,
    })
    res.json(tasks);
})

app.get("/tasks/detail/:id",async (req,res)=>{
    const id = req.params.id;
    const tasks = await Task.findOne({
        _id:id,
        deleted:false
    })
    res.json(tasks);
})

app.listen(port, () => {
    console.log(`example app listen on port ${port}`);
});