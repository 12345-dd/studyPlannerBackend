const router = require("express").Router();
const userController = require("../controllers/UserController");

// @api User Register
router.post("/user",userController.registerUser);

// @api User Login
router.post("/login",userController.loginUser);

module.exports = router;