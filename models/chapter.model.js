const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema(
  {
    chapterNumber: { type: Number, required: true },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    story: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Story",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chapter", chapterSchema);
