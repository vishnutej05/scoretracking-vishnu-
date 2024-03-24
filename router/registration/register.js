const express = require("express");
const router = express.Router();
const CryptoJS = require("crypto-js");
const is_valid_profile = require("../../middlewares/is_valid_profile");
require("dotenv").config();
const jwt = require("jsonwebtoken");

// models
const solved_model = require("../../models/solved_problems");
const tracked_scores_model = require("../../models/tracked_scores");
const leaderboard_model = require("../../models/leaderboard");
const User = require("../../models/user");

function is_profile_available(req, res, next) {
  let body = req.body;
  if (
    body.name &&
    body.rollno &&
    body.codechef &&
    body.codeforces &&
    body.hackerrank &&
    body.leetcode &&
    body.spoj
  ) {
    // console.log(body);
    next();
  } else {
    res.status(400).send("Please fill all the details");
  }
}

router.get("/", async (req, res) => {
  res.send("registration page");
});

router.post("/", is_profile_available, is_valid_profile, async (req, res) => {
  let body = req.body;
  try {
    let roll_no = body.rollno;
    let solved_user = await solved_model.findOne({ roll_no });
    if (solved_user) {
      throw new Error("User already exists");
      return;
    }

    const EncryptedPass = CryptoJS.AES.encrypt(
      body.password,
      process.env.secretKey
    ).toString();

    let solved_doc = await solved_model.collection.insertOne({
      roll_no: body.rollno,
      codechef_last_refreshed: new Date(0),
      codechef_solved: [],
      codeforces_last_refreshed: new Date(0),
      codeforces_solved: [],
      hackerrank_last_refreshed: new Date(0),
      hackerrank_solved: [],
      spoj_last_refreshed: new Date(0),
      spoj_solved: [],
    });
    let tracked_scores_doc = await tracked_scores_model.collection.insertOne({
      roll_no: body.rollno,
      lc_solved: 0,
      lc_rating: 0,
      cc_solved: 0,
      cc_rating: 0,
      cf_solved: 0,
      cf_rating: 0,
      hr_solved: 0,
      spoj_solved: 0,
      lc_leaderboard_score: 0,
      cc_leaderboard_score: 0,
      cf_leaderboard_score: 0,
      hr_leaderboard_score: 0,
      spoj_leaderboard_score: 0,
      total_leaderboard_score: 0,
    });
    let leaderboard_doc = await leaderboard_model.collection.insertOne({
      user_name: body.name,
      roll_no: body.rollno,
      lc_leaderboard_score: 0,
      cf_leaderboard_score: 0,
      cc_leaderboard_score: 0,
      hr_leaderboard_score: 0,
      spoj_leaderboard_score: 0,
      total_leaderboard_score: 0,
    });
    let user_doc = await User.collection.insertOne({
      roll_no: body.rollno,
      name: body.name,
      password: EncryptedPass,
      email: body.email,
      codechef_handle: body.codechef,
      leetcode_handle: body.leetcode,
      codeforces_handle: body.codeforces,
      hackerrank_handle: body.hackerrank,
      spoj_handle: body.spoj,
      leaderboard_ref: leaderboard_doc.insertedId,
      credential_ref: tracked_scores_doc.insertedId,
      problems_solved: solved_doc.insertedId,
    });

    console.log(user_doc);
    console.log(solved_doc);
    console.log(tracked_scores_doc);
    console.log(leaderboard_doc);
    res.send(body);
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
});
module.exports = router;
