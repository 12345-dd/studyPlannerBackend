const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/smartStudyPlanner").then(()=>{
    console.log("Database is Connected");
}).catch((err)=>{
    console.log(`Error in connected database - ${err}`);
})

const userRoutes = require("./src/routes/UserRoutes");
const taskRoutes = require("./src/routes/TaskRoutes");

app.use("/user",userRoutes);
app.use("/task",taskRoutes);

const PORT = 4000;

app.listen(PORT,()=>{
    console.log(`Server Started at port - ${PORT}`)
})