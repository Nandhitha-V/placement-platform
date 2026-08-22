const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // e.g. "DSA", "Aptitude" — no duplicates
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    icon: {
      type: String, // we'll store an icon name/emoji for now, real assets later
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);