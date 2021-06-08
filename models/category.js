const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: {
        unique: true,
      },
    },
    description: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: true,
    },
    itemPictures: [{ img: { type: String, required: false } }],
    question: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SignUpSchema",
      required: true,
    },
    createdAt:{
        type:Number
    },
    updatedAt:{
        type:Number
    }
  },
  {
    timestamps: {
      currentTime: () => Date.now()
    },
  }
);

const postitem = mongoose.model("PostItem", CategorySchema);
// const requestitem=mongoose.model('RequestItem',CategorySchema)
module.exports = {
  postitem: postitem,
};
