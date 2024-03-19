const axios=require('axios')
const moment = require('moment');
const { JSDOM } = require('jsdom');

class Codechef{
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
}

async function main(){
    let codechef = new Codechef("m_2002for2025");   
    let data = await codechef.get_credentials();
    console.log(data);
}
main();