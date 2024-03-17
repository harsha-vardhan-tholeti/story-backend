const express = require("express");
const {
  createChapter,
  updateChapter,
  deleteChapter,
  getAllChapters,
  getChapter,
} = require("../controllers/chapter.controller");
const { protect } = require("../middlewares/authorization");
const router = express.Router({ mergeParams: true });

router.route("/").get(getAllChapters).post(protect, createChapter);
router
  .route("/:chapterId")
  .get(getChapter)
  .patch(protect, updateChapter)
  .delete(protect, deleteChapter);

module.exports = router;
