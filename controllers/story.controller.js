const Story = require("../models/story.model");
const createError = require("../utils/createError");

const getAllStories = async (req, res, next) => {
  try {
    const stories = await Story.find();

    if (!stories) return next("no stories are available right now!", 400);

    res.status(200).json({
      success: true,
      data: stories,
    });
  } catch (error) {
    next(error);
  }
};

const getStory = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.storyId);

    if (!story) return next("story bot available", 400);

    res.status(200).json({
      success: true,
      data: story,
    });
  } catch (error) {
    next(error);
  }
};

const createStory = async (req, res, next) => {
  try {
    const { title, description, category, tags } = req.body;

    const story = await Story.create({
      title,
      description,
      author: req.user,
      category,
      tags,
    });

    res.status(201).json({
      success: true,
      data: story,
    });
  } catch (error) {
    next(error);
  }
};

const updateStory = async (req, res, next) => {
  try {
    const { title, description, category, tags } = req.body;

    const updatedStory = await Story.findByIdAndUpdate(
      req.params.storyId,
      {
        title,
        description,
        category,
        tags,
      },
      { new: true }
    );

    if (!updatedStory) return next(createError("Story not found", 400));

    res.status(200).json({
      success: true,
      data: updatedStory,
    });
  } catch (error) {
    next(error);
  }
};

const deleteStory = async (req, res, next) => {
  try {
    const deleteStory = await Story.findByIdAndDelete(req.params.storyId);

    if (!deleteStory) return next(createError("Story not found", 404));

    res.status(200).json({
      success: true,
      message: "Story deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllStories,
  getStory,
  createStory,
  updateStory,
  deleteStory,
};
