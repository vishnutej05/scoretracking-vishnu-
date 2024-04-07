const express = require("express");
const router = express.Router();

const Dashboard = require("../../models/dashboard");

router.get("/", async (req, res) => {
  // console.log(req.rollno);
  try {
    const dashboard = await Dashboard.findOne({ roll_no: req.rollno });
    // console.log(dashboard);
    res.status(200).json([{ dashboard_details: dashboard }]);
  } catch (error) {
    console.error("Error retrieving resume:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
