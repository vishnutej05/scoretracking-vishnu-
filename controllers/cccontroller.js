const axios = require('axios');
const cheerio = require('cheerio');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

var acceptedSolutions = [];

// Function to scrape recent activity
async function scrapeRecentActivity(username, page) {
    try {
        const baseURL = `https://www.codechef.com/recent/user?page=${page}&user_handle=${username}&_=1710851539301`;
        const response = await axios.get(baseURL);
        const html = response.data;

        const pagecount = html.max_page;
        var htmlContent = html.content;

        const $ = cheerio.load(htmlContent);

        // Find all table rows
        var rows = $('tr');

        rows.each(function () {
            var cols = $(this).find('td');
            if (cols.length >= 3) {
                var time = $(cols[0]).attr('title');
                var problem = $(cols[1]).text().trim();
                var problemLink = $(cols[1]).find('a').attr('href');
                var result = $(cols[2]).find('span').attr('title');
                if (result === 'accepted') {
                    acceptedSolutions.push({ time: time, problem: problem, problemLink: `https://www.codechef.com${problemLink}` });
                }
            }
        });
        if (page < pagecount) {
             return scrapeRecentActivity(username, page + 1);
        } else {
            // console.log(acceptedSolutions);
            return acceptedSolutions;
        }

    } catch (error) {
        console.error('Error occurred while scraping recent activity:', error);
        throw error; // Rethrow the error to handle it in the calling function
    }
}

const codechefstats = async (req, res) => {
    try {
        // Scrape recent activity
        const acceptedSolutions = await scrapeRecentActivity(req.params.handle, 1);

        let data = await axios.get(`https://www.codechef.com/users/${req.params.handle}`);
            let dom = new JSDOM(data.data);
            let document = dom.window.document;

        // Add the scraped data to the response
        res.status(200).send({
            success: true,
            profile: document.querySelector('.user-details-container').children[0].children[0].src,
            name: document.querySelector('.user-details-container').children[0].children[1].textContent,
            currentRating: parseInt(document.querySelector(".rating-number").textContent),
            highestRating: parseInt(document.querySelector(".rating-number").parentNode.children[4].textContent.split('Rating')[1]),
            countryFlag: document.querySelector('.user-country-flag').src,
            countryName: document.querySelector('.user-country-name').textContent,
            globalRank: parseInt(document.querySelector('.rating-ranks').children[0].children[0].children[0].children[0].innerHTML),
            countryRank: parseInt(document.querySelector('.rating-ranks').children[0].children[1].children[0].children[0].innerHTML),
            stars: document.querySelector('.rating').textContent || "unrated",
            problemsSolved: acceptedSolutions.length,
            acceptedSolutions: acceptedSolutions // Add the accepted solutions to the response
        });
    } catch (err) {
        res.send({ success: false, error: err });
    }
}

const cc_checkcontroller = async (req, res) => {
    res.status(200).send("this router for codechef");
}

module.exports = {
    codechefstats,
    cc_checkcontroller
}
