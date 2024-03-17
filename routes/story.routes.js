const express = require("express");
const {
  createStory,
  updateStory,
  deleteStory,
  getStory,
  getAllStories,
} = require("../controllers/story.controller");
const ChapterRouter = require("../routes/chapter.routes");
const { protect } = require("../middlewares/authorization");
const router = express.Router();

router.use("/:storyId/chapter", ChapterRouter);

router.route("/").get(getAllStories).post(protect, createStory);

router
  .route("/:storyId")
  .get(getStory)
  .patch(protect, updateStory)
  .delete(protect, deleteStory);

module.exports = router;
