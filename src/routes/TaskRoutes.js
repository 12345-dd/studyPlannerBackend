const router = require("express").Router();
const TaskController = require("../controllers/TaskController");

// @api add Task
router.post("/addTask",TaskController.createTask);

// @api get task by id
router.get("/getTask/:id",TaskController.getTask);

// @api update task by id
router.put("/updateTask/:id",TaskController.updateTask);

// @api delete task by id
router.delete("/deleteTask/:id",TaskController.deleteTask)

module.exports = router;