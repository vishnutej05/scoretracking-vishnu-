const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const codechefstats=async (req, res) => {
        try {
            let data = await axios.get(`https://www.codechef.com/users/${req.params.handle}`);
            let dom = new JSDOM(data.data);
            let document = dom.window.document;
    
            const linksArray = [];
            const linkarr = document.querySelector('section.rating-data-section:nth-child(7)').querySelectorAll('a')
            linkarr.forEach(link => {
            const href = link.getAttribute('href');
            const content = link.childNodes[0].data;
            linksArray.push({ href, content });
            });
    
            // response data 
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
                problemsSolved: linkarr.length,
            });
        } catch (err) {
            res.send({ success: false, error: err });
            
        }
    }

const cc_checkcontroller=async (req, res) => {
    res.status(200).send("this router for codecehf");
}

module.exports = {
    codechefstats,
    cc_checkcontroller
}