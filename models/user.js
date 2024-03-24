const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  roll_no: {
    type: "string",
    required: true,
    unique: true,
  },
  name: {
    type: "string",
    // "required": true
  },
  password: {
    type: "string",
    // "required": true
  },
  email: {
    type: "string",
  },
  // "courses_ref": {
  //   "type": ["array", "reference"],
  //   "items": {
  //     "type": "ObjectId",
  //     "ref": "Course"
  //   }
  // },
  codechef_handle: {
    type: "string",
    required: true,
  },
  leetcode_handle: {
    type: "string",
    required: true,
  },
  codeforces_handle: {
    type: "string",
    required: true,
  },
  hackerrank_handle: {
    type: "string",
    required: true,
  },
  spoj_handle: {
    type: "string",
    required: true,
  },
  leaderboard_ref: {
    type: "ObjectId",
    ref: "Leaderboard",
    required: true,
  },
  credential_ref: {
    type: "ObjectId",
    ref: "Tracked_Scores",
    required: true,
  },
  problems_solved: {
    type: "ObjectId",
    ref: "ProblemsSolvedByStudent",
    required: true,
  },
});

userSchema.index({ roll_no: 1 });
const Users = mongoose.model("User", userSchema);
module.exports = Users;
