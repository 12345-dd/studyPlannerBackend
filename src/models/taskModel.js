const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    status:{
        type:String,
        enum:['Pending','Completed'],
        default:"Pending"
    },
    deadline:{
        type:Date
    },
    priority:{
        type:String,
        enum:["High","Medium","Low"],
        default:"Medium"
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{
    timestamps:true
})

module.exports = mongoose.model("Task",taskSchema);