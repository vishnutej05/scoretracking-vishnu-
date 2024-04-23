const router = require("express").Router();
let leaderboard_model = require("../../models/leaderboard");

router.get("/", async (req, res) => {
  let data = await leaderboard_model
    .find({})
    .sort({ total_leaderboard_score: -1 });
  let rank = 1;
  let ret = data.map((item) => {
    let row = item._doc;
    return {
      id: row._id,
      name: row.user_name,
      roll_no: row.roll_no,
      leetcode: parseInt(row.lc_leaderboard_score),
      codeforces: parseInt(row.cf_leaderboard_score),
      codechef: parseInt(row.cc_leaderboard_score),
      hackerrank: parseInt(row.hr_leaderboard_score),
      spoj: parseInt(row.spoj_leaderboard_score),
      totalScore: parseInt(row.total_leaderboard_score),
      rank: rank++,
    };
  });
  console.log(ret);
  res.json(ret);
});
module.exports = router;
