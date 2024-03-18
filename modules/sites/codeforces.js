const axios = require("axios");

async function fetchSubmissions(username) {
  try {
    const url = `https://codeforces.com/api/user.status?handle=${username}&from=1&count=10000`;
    const response = await axios.get(url);
    const submissions = response.data.result;

    const successfulSubmissions = submissions.filter(
      (submission) => submission.verdict === "OK"
    );

    const extractedData = successfulSubmissions.map((submission) => {
      const submissionTime = new Date(
        submission.creationTimeSeconds * 1000
      ).toLocaleDateString("en-GB");
      const problemName = submission.problem.name;
      const problemLink = `https://codeforces.com/problemset/problem/${submission.problem.contestId}/${submission.problem.index}`;
      return { time: submissionTime, name: problemName, link: problemLink };
    });

    console.log(extractedData);
    console.log(extractedData.length);

    return extractedData;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

const username = "Tvish7962";
fetchSubmissions(username);