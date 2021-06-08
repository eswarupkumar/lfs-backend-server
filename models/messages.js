const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CategorySchema",
      required: true,
    },
    belongsTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SignUpSchema",
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      default: "Moderation",
    },
    givenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SignUpSchema",
      required: true,
    },
    createdAt: {
      type: Number,
    },
    updatedAt: {
      type: Number,
    },
  },
  {
    timestamps: {
      currentTime: () => Date.now(),
    },
  }
);

const messageschema = mongoose.model("MessageSchema", messageSchema);
module.exports = messageschema;
