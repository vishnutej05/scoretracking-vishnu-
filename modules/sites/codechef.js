const axios=require('axios')
const moment = require('moment');
const { JSDOM } = require('jsdom');
const cheerio = require('cheerio');

class Codechefclass {
    constructor(handle){
        this.site = "Codechef";
        this.handle = handle;
    }
    async get_credentials(){
        let handle=this.handle;
        try {
            let data = await axios.get(`https://www.codechef.com/users/${handle}`);
            let dom = new JSDOM(data.data);
            let document = dom.window.document;
            
            // get all the links in the problems solved section
            const linksArray = [];
            const linkarr = document.querySelector('section.rating-data-section:nth-child(7)').querySelectorAll('a')
            linkarr.forEach(link => {
            const href = link.getAttribute('href');
            const content = link.childNodes[0].data;
            linksArray.push({ href, content });
            });
    
            // response data 
            return({
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
            return({ success: false, error: err });
            
        }  
    }

    async get_subbmissions(last_retrieved){ 
        
        // console.log("page",page); 
        let acceptedSolutions = [];   
        let page =1;
        let handle=this.handle;
        const baseURL = `https://www.codechef.com/recent/user?page=${page}&user_handle=${handle}&_=1710851539301`;
        const response = await axios.get(baseURL);
        const html = response.data;
        const pagecount = html.max_page;
        var htmlContent = html.content;
        const $ = cheerio.load(htmlContent);
        var rows = $('tr');
        rows.each(function () {
            var cols = $(this).find('td');
            if (cols.length >= 3) {
                var time = $(cols[0]).attr('title');
                var problem = $(cols[1]).text().trim();
                var problemLink = $(cols[1]).find('a').attr('href');
                var result = $(cols[2]).find('span').attr('title');
                // console.log(time);
                if (result === 'accepted') {
                    acceptedSolutions.push({ time: time, problem: problem, problemLink: `https://www.codechef.com${problemLink}` });
                }
            }
        });    
        return(acceptedSolutions.length);
    }
}

// async function main(){
//     let codechef = new Codechef("m_2002for2025");   
//     let data = await codechef.get_credentials();
//     console.log(data);
// }
// main();

module.exports = Codechefclass;