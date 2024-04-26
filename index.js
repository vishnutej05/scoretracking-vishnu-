const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
//dbconnect
const { databaseconnect } = require("./dbconfig");

//starter problem model
const { Problems } = require("./models/all_problems");

const ccrouter = require("./router/codechefscores");
const lcrouter = require("./router/leetcodescores");
const hrrouter = require("./router/hackerrankscore");
const spojrouter = require("./router/spojscores");
const codeforcesrouter = require("./router/codeforcesscore");
const leaderboardsortedrouter = require("./router/leaderboardroutes/sortedboard");
const regisrationrouter = require("./router/registration/register");
const authenticaterouter = require("./router/registration/authenticate");
const sendotprouter = require("./router/registration/send_otp");
const getcredentialsrouter = require("./router/registration/get_creds");
const updatephonerouter = require("./router/dashboard/update_phone");
const updateemailrouter = require("./router/dashboard/update_email");
const updatedetailsrouter = require("./router/dashboard/update_details");
const updateImagerouter = require("./router/dashboard/update_image");
const upcommingcontestrouter = require("./router/upcommingcontests");
const jobsrouter = require("./router/fetchjobs");
const uploadresumerouter = require("./router/dashboard/update_resume");
const dashboardrouter = require("./router/dashboard/get_dashboard");
const uploadCertificatesRouter = require("./router/dashboard/upload_certificates");
// models
const Users = require("./models/user");
const mainf = require("./modules/sites/scoresupdataion");

// dbconnection
databaseconnect();

// cors
app.use(
  cors({
    origin: "*",
  })
);

//
const authenticate = require("./middlewares/is_valid_user");
// parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// routes
app.get("/", (req, res) => {
  const routeDescriptions = `
    /codechef:
    Route for handling requests related to CodeChef.
    May include endpoints for fetching CodeChef contest information, user submissions, etc.

    /leetcode:
    Route for handling requests related to LeetCode.
    May include endpoints for fetching LeetCode problem sets, user submissions, etc.

    /hackerrank:
    Route for handling requests related to HackerRank.
    May include endpoints for fetching HackerRank challenges, user submissions, etc.

    /spoj:
    Route for handling requests related to SPOJ (Sphere Online Judge).
    May include endpoints for fetching SPOJ problems, user submissions, etc.

    /codeforces:
    Route for handling requests related to Codeforces.
    May include endpoints for fetching Codeforces contests, problems, user submissions, etc.

    /leaderboard:
    Route for retrieving a sorted leaderboard.
    May include endpoints for fetching leaderboard rankings, scores, etc.

    /register:
    Route for user registration/authentication.
    May include endpoints for user registration, account creation, etc.

    /authenticate:
    Route for user authentication.
    May include endpoints for user login, session management, etc.

    /sendotp:
    Route for sending OTP (One-Time Password) for authentication.
    May include endpoints for sending OTP to users' registered email or phone number.

    /getcreds:
    Route for retrieving user credentials.
    May include endpoints for fetching user credentials like email, phone number, etc.

    /upcomming-contests:
    Route for fetching upcoming contests.
    May include endpoints for retrieving information about upcoming coding contests.

    /jobs:
    Route for handling job-related requests.
    May include endpoints for fetching job listings, applying for jobs, etc.

    /uresume:
    Route for uploading user resumes.
    May include endpoints for users to upload and manage their resumes.

    /dashboard:
    Route for user dashboard functionality.
    May include endpoints for fetching user-specific data to display on the dashboard.

    /ucertificate:
    Route for uploading user certificates.
    May include endpoints for users to upload and manage their certificates.
  `;

  res.send(routeDescriptions);
});

app.use("/codechef", ccrouter);
app.use("/leetcode", lcrouter);
app.use("/hackerrank", hrrouter);
app.use("/spoj", spojrouter);
app.use("/codeforces", codeforcesrouter);
app.use("/leaderboard", leaderboardsortedrouter);
app.use("/register", regisrationrouter);
app.use("/authenticate", authenticaterouter);
app.use("/sendotp", sendotprouter);
app.use("/getcreds", getcredentialsrouter);
app.use("/uemail", authenticate, updateemailrouter);
app.use("/uphone", authenticate, updatephonerouter);
app.use("/udetails", authenticate, updatedetailsrouter);
app.use("/uimage", authenticate, updateImagerouter);
app.use("/upcomming-contests", upcommingcontestrouter);
app.use("/jobs", jobsrouter);
app.use("/uresume", authenticate, uploadresumerouter);
app.use("/dashboard", authenticate, dashboardrouter);
app.use("/ucertificate", authenticate, uploadCertificatesRouter);

app.get("/updateall", async (req, res) => {
  let mainf = require("./modules/sites/scoresupdataion");
  let allusers = await Users.find({});
  for (users of allusers) {
    req.body.rollno = users.roll_no;
    req.body.codechef = users.codechef_handle;
    req.body.leetcode = users.leetcode_handle;
    req.body.codeforces = users.codeforces_handle;
    req.body.spoj = users.spoj_handle;
    req.body.hackerrank = users.hackerrank_handle;
    console.log(req.body);
    await mainf(req.body);
  }
  res.send("all Updated");
});

app.get("/update", async (req, res) => {
  let mainf = require("./modules/sites/scoresupdataion");
  console.log(req.body);
  await mainf(req.body);
  res.send("Updated");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
});

const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
