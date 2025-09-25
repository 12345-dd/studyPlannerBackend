const router = require("express").Router();
const userController = require("../controllers/UserController");

// @api User Register
// @body name, email, password
// @header Content-Type: application/json
router.post("/user",userController.registerUser);

// @api User Login
// @body email, password
// @header Content-Type: application/json
router.post("/login",userController.loginUser);

module.exports = router;