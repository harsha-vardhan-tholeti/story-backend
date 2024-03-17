const Story = require("../models/story.model");
const Chapter = require("../models/chapter.model");
const createError = require("../utils/createError");

const getAllChapters = async (req, res, next) => {
  try {
    const storyId = req.params.storyId || req.body.storyId;

    if (!storyId) return next(createError("Story not found", 400));

    const story = await Story.findById(storyId);

    if (!story) return next(createError("Story not found", 400));

    const chapters = await Chapter.find({
      story: storyId,
    });

    res.status(200).json({
      success: true,
      data: chapters,
    });
  } catch (error) {
    next(error);
  }
};

const getChapter = async (req, res, next) => {
  try {
    const chapter = await Chapter.findById(req.params.chapterId);

    if (!chapter) return next(createError("Chapter not found", 400));

    res.status(200).json({
      success: true,
      data: chapter,
    });
  } catch (error) {
    next(error);
  }
};

const createChapter = async (req, res, next) => {
  try {
    const storyId = req.params.storyId || req.body.storyId;

    const story = await Story.findById(storyId);

    if (!story) return next(createError("Story not found", 400));

    const { chapterNumber, title, content } = req.body;

    const chapter = await Chapter.create({
      chapterNumber,
      title,
      content,
      story: req.params.storyId || req.body.storyId,
    });

    await Story.findByIdAndUpdate(
      req.params.storyId,
      {
        $push: { chapters: chapter._id },
      },
      { new: true }
    );

    res.status(201).json({
      success: true,
      data: chapter,
    });
  } catch (error) {
    next(error);
  }
};

const updateChapter = async (req, res, next) => {
  try {
    const { chapterNumber, title, content } = req.body;

    const updatedChapter = await Chapter.findByIdAndUpdate(
      req.params.id,
      {
        chapterNumber,
        title,
        content,
      },
      { new: true }
    );

    if (!updateChapter) return next(createError("Chapter not found", 400));

    res.status(200).json({
      success: true,
      data: updatedChapter,
    });
  } catch (error) {
    next(error);
  }
};

const deleteChapter = async (req, res, next) => {
  try {
    const deletedChapter = await Chapter.findByIdAndDelete(
      req.params.chapterId
    );

    if (!deletedChapter) return next(createError("Chapter not found", 400));

    await Story.findByIdAndUpdate(
      req.params.storyId,
      {
        $pull: { chapters: req.params.chapterId },
      },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "Chapter deleted!",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllChapters,
  getChapter,
  createChapter,
  updateChapter,
  deleteChapter,
};
