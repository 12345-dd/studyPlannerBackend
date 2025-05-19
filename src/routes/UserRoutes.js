const router = require("express").Router();
const userController = require("../controllers/UserController");

router.post("/user",userController.registerUser);

router.post("/login",userController.loginUser);

module.exports = router;