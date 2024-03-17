const express = require("express");
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getMe,
  updateMe,
  deleteMe,
} = require("../controllers/user.controller");
const { protect, restrictTo } = require("../middlewares/authorization");
const router = express.Router();

router.use(protect);

router.route("/me").get(getMe);
router.route("/updateMe").patch(updateMe);
router.route("/deleteMe").patch(deleteMe);

router.use(restrictTo("admin"));

router.route("/").get(getAllUsers);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
