const express = require("express");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("../controllers/auth.controller");
const { protect } = require("../middlewares/authorization");
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:id").patch(resetPassword);
router.route("/updatePassword").patch(protect, updatePassword);

module.exports = router;
