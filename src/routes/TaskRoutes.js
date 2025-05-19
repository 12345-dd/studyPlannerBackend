const router = require("express").Router();
const TaskController = require("../controllers/TaskController");

router.post("/addTask",TaskController.createTask);
router.get("/getTask/:id",TaskController.getTask);
router.put("/updateTask/:id",TaskController.updateTask);
router.delete("/deleteTask/:id",TaskController.deleteTask)

module.exports = router;