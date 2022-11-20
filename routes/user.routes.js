const userController = require("../controller/user.controller");
const Router = require("express");

const router = new Router();

router.post("/users", userController.createUser);
router.get("/users", userController.getUsers);
router.get("/users/:id", userController.getOneUser);
router.get("/users/:id/friends", userController.getUserFriends);

module.exports = router;
