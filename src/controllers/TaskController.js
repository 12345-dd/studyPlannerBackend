const Task = require('../models/taskModel');
const { isValidDate, formatDate } = require('../utils/dateValidator');

const createTask = async (req, res) => {
  try {
    const { title, description, status, deadline, priority, user } = req.body;

    if (deadline && !isValidDate(deadline)) {
      return res.status(400).json({ error: "Invalid deadline date format" });
    }

    const task = await Task.create({
      title,
      description,
      status,
      deadline: formatDate(deadline),
      priority,
      user,
    });

    res.status(201).json({
        message:"Task Has been Created Successfully",
        data:task
    })
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTask = async(req,res) => {
    try{
        const {id} = req.params;
        const task = await Task.find({user:id}).sort({createdAt:-1});
        if(task.length > 0){
            res.status(200).json({
                message:"Getting Task Successfully",
                data:task
            })
        }else{
            res.status(404).json({
                message:"Error in getting Task"
            })
        }
    }catch(err){
        res.status(500).json({error:err.message})
    }
}

const updateTask = async(req,res) => {
    try{
        const {id} = req.params;
        const updatedTask = await Task.findByIdAndUpdate(id,req.body,{new:true});

        if(!updatedTask){
            return res.status(404).json({error:"Task Not Found"});
        }
        res.status(200).json({
            message:"Task Updated Successfully",
            data:updatedTask
        })
    }catch(err){
        res.status(400).json({error:err.message})
    }
}


const deleteTask = async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid task ID or request' });
  }
};


module.exports = { 
    createTask,
    getTask,
    updateTask,
    deleteTask
};
