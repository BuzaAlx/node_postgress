const postController = require("../controller/follower.controller");
const Router = require("express");

const router = new Router();

router.post("/add-follower", postController.addFollower);
router.get("/max-following", postController.maxFollowind);
router.get("/not-following", postController.notFollowind);

module.exports = router;
