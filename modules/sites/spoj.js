const jsdom=require('jsdom');
const { JSDOM } = jsdom;    
const axios = require('axios'); 
const moment = require('moment');


class Spoj{ 
    constructor(handle){
        this.site = "Spoj";
        this.handle = handle;
    }
     // Define your list of request failure status codes
    async  isInvalidHandle() {
        let handle = this.handle;
        const REQUEST_FAILURES = [400, 401, 403, 404, 429];
        try {
            const response = await axios.get(`http://www.spoj.com/users/${handle}`, { timeout: 10000 });
            
            if (REQUEST_FAILURES.includes(response.status)) {
            return true;
            }

            // Check if the handle exists by searching for a specific text in the response body
            if (response.data.includes("History of submissions")) {
            return false; // Handle exists
            } else {
            return true; // Handle does not exist
            }
        } catch (error) {
            // Handle request errors or timeouts
            console.error("Error checking handle:", error);
            return true; // Consider it as an invalid handle due to error
        }
    }

    
    // _________________________________________________________todo
    
    // async get_stats(last_retrieved){
    //     let response = await axios.get(`http://www.spoj.com/users/${this.handle}`);
    //     response = response.data;
    //     const dom = new JSDOM(response);
    //     const document = dom.window.document;
    //     return {
    //         "user_name": document.querySelector('#user-profile-left > h3:nth-child(2)').innerHTML,
    //         "World_Rank":document.querySelector('#user-profile-left > p:nth-child(6)').innerHTML.slice(-17),
    //         "total_subbmissions":document.querySelector('.dl-horizontal > dd:nth-child(4)').innerHTML,
    //         "Problems solved":document.querySelector('.dl-horizontal > dd:nth-child(2)').innerHTML,
    //     }
    // }


    async get_submissions(last_retrieved){
        last_retrieved = moment(last_retrieved).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
        let handle = this.handle;
        const baseUrl = `https://www.spoj.com/status/${handle}/all/start=`;
        const results = [];

        let start = 0;

        while (true) {
        const nextPageUrl = baseUrl + start;
        const response = await axios.get(nextPageUrl);
        const html = await response.data

        const dom = new JSDOM(html);
        const doc = dom.window.document;

        const problemRows = Array.from(doc.querySelectorAll(".kol1")).map((element) => {
            const timestamp = element.querySelector(".status_sm span")?.getAttribute("title");
            const problemLink = element.querySelector(".sproblem a");
            const problemName = problemLink.textContent.trim();
            const problemUrl = problemLink.getAttribute("href");
            const formattedTimestamp = moment(timestamp).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
            return {
            time: formattedTimestamp,
            name: problemName,
            link: `https://www.spoj.com${problemUrl}`,
            };
        });

        if (problemRows.length === 0) {
            return results;
            break;
        }

        for(let row of problemRows){
            let timestamp = moment(row.time).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
            if (moment(timestamp) <= moment(last_retrieved)) {
                return results;
            }
            results.push(row);
        }
        start += 20; // Increment start index for the next page
        }

        return (results);
    }
}


async function main(){
    const spoj = new Spoj("bhargavdhasdf5");
    // const submissions = await spoj.get_submissions(moment('2024-02-17 08:50:08'));
    // console.log(submissions.length);
    console.log(await spoj.get_stats());
}
main();