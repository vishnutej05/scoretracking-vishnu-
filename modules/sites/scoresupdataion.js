const axios =require('axios');  
const moment = require('moment');
// models
const solved_model=require("../../models/solved_problems");
const tracked_scores_model=require("../../models/tracked_scores");
const leaderboard_model=require("../../models/leaderboard");
const Problems_model=require("../../models/all_problems");

class Process_scores{
    constructor({rollno,codechef,codeforces,hackerrank,spoj,leetcode}) {
        this.rollno=rollno;
        this.codechef_handle=codechef;
        this.codeforces_handle=codeforces;
        this.hackerrank_handle=hackerrank;
        this.spoj_handle=spoj;
        this.leetcode_handle=leetcode;
    }
    async updatecodeforces(codeforces_last_refreshed,codeforces_handle){
        let last_retrieved=codeforces_last_refreshed;
        console.log(last_retrieved);
        // console.log("code forces update method called_________________________");
        let Codeforcesclass=require("./codeforces");
        let codeforces_obj=new Codeforcesclass(codeforces_handle);
        last_retrieved=(moment(last_retrieved).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'));
        console.log("last_retrieved",last_retrieved);
        let data=await codeforces_obj.fetchSubmissions(last_retrieved);
        return data;

    }

    async updatecodechef(codechef_last_refreshed,codechef_handle){
        let last_retrieved=codechef_last_refreshed;
        console.log("codechef update method called_________________________");
        let Codechefclass=require("./codechef");
        let codechef_obj=new Codechefclass(codechef_handle);
        last_retrieved=(moment(last_retrieved).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'));
        console.log("last_retrieved",last_retrieved);
        let data=await codechef_obj.fetch_from_time(last_retrieved);
        return data;
    }

    async updatespoj(spoj_last_refreshed,spoj_handle){
        let last_retrieved=spoj_last_refreshed;
        console.log("spoj update method called_________________________");
        let Spojclass=require("./spoj");
        let spoj_obj=new Spojclass(spoj_handle);
        last_retrieved=(moment(last_retrieved).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'));
        console.log("last_retrieved",last_retrieved);
        let data=await spoj_obj.get_submissions(last_retrieved);
        return data;
    };

    async updatehackerrank(hackerrank_last_refreshed,hackerrank_handle){
        let last_retrieved=hackerrank_last_refreshed;
        console.log("hackerrank update method called_________________________");
        let Hackerrankclass=require("./hackerrank");
        let hackerrank_obj=new Hackerrankclass(hackerrank_handle);  
        last_retrieved=(moment(last_retrieved).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'));
        console.log("last_retrieved",last_retrieved);
        let data=await hackerrank_obj.get_submissions(last_retrieved);
        return data;
    }


    async Process_scores_method(){
        try{
            console.log("Inside Process_scores_method");
            let rollno=this.rollno;
            let codechef_handle=this.codechef_handle;
            let codeforces_handle=this.codeforces_handle;
            let hackerrank_handle=this.hackerrank_handle;
            let spoj_handle=this.spoj_handle;
            let leetcode_handle=this.leetcode_handle;
            
            let solved_doc=await solved_model.find({roll_no:rollno});
            if(solved_doc.length==0)return "failed";
            let { _id,codechef_last_refreshed,codeforces_last_refreshed,hackerrank_last_refreshed,spoj_last_refreshed,
                codechef_solved,codeforces_solved,hackerrank_solved,spoj_solved}=solved_doc[0]; 
            
            
            // codeforces newly solved problems
            // todo
            let cfnewlysolved=await this.updatecodeforces(codeforces_last_refreshed,codeforces_handle);
            console.log("cfnewlysolved",cfnewlysolved.length);
            codeforces_last_refreshed=cfnewlysolved[0]?.time;
            if(cfnewlysolved.length > 0 ){
                let solved_doc_for_update= await solved_model.findById(_id);
                solved_doc_for_update.codeforces_last_refreshed=codeforces_last_refreshed;
                await solved_doc_for_update.save();
            }
            // // console.log("codeforces_last_refreshed",codeforces_last_refreshed);

            // //checking problems are alresy availble or not and performing operations
                
                
            cfnewlysolved.forEach(async (element) => {
                
                let problem_doc=await Problems_model.find({"problem_name":element.name});
                // console.log(problem_doc);
                if(problem_doc.length > 0 ){
                    let solved_doc_for_update= await solved_model.findById(_id);
                    //alredy have problem in db
                    // console.log(problem_doc[0]);
                    // console.log("user_id",_id)
                    // console.log("problem id",problem_doc[0]._id);
                    let already_reference_present=solved_doc_for_update.codeforces_solved.find((ele)=>{ return ele.equals(problem_doc[0]._id); });
                    if(! already_reference_present){
                        console.log("the refernece not present now pushing it to solved");
                        solved_doc_for_update.codeforces_solved.push((problem_doc[0]._id));
                        let data=await solved_doc_for_update.save();
                        // console.log("recieved:",data);
                    }
                    else {
                        console.log("newly solved already present");
                    }

                    
                }else {
                    let solved_doc_for_update= await solved_model.findById(_id);
                    console.log("creating new problem and updating...");
                    let problem_data={
                        problem_name:element.name,
                        problem_href:element.link,
                        site_name:"CodeForces"
                    };
                    console.log(element.name+" not already exists in db");
                    let problem_doc=await Problems_model.collection.insertOne(problem_data);
                    console.log("problem inserted",problem_doc);
                    // console.log(problem_doc);
                    solved_doc_for_update.codeforces_solved.push((problem_doc.insertedId));
                    let data=await solved_doc_for_update.save();
                    console.log("recieved:",data);
                }
            });
            

            // ______________________________________________________________________________________________________________

            // codechef newly solved problems
            let ccnewlysolved=await this.updatecodechef(codechef_last_refreshed,codechef_handle);
             console.log("ccnewlysolved",ccnewlysolved.length);
             codechef_last_refreshed=ccnewlysolved[0]?.time;
             
            if(ccnewlysolved.length > 0 ){
                let solved_doc_for_update= await solved_model.findById(_id);
                solved_doc_for_update.codechef_last_refreshed=codechef_last_refreshed;
                await solved_doc_for_update.save();
            }
             console.log("codechef_last_refreshed",codechef_last_refreshed);

            ccnewlysolved.forEach(async (element) => {
                let problem_doc=await Problems_model.find({"problem_name":element.problem});
                // console.log(problem_doc);
                if(problem_doc.length > 0 ){
                    let solved_doc_for_update= await solved_model.findById(_id);
                    //alredy have problem in db
                    // console.log(problem_doc[0]);
                    // console.log("user_id",_id)
                    // console.log("problem id",problem_doc[0]._id);
                    let already_reference_present=solved_doc_for_update.codechef_solved.find((ele)=>{ return ele.equals(problem_doc[0]._id); });
                    if(! already_reference_present){
                        console.log("the refernece not present now pushing it to solved");
                        solved_doc_for_update.codechef_solved.push((problem_doc[0]._id));
                        let data=await solved_doc_for_update.save();
                        // console.log("recieved:",data);
                    }
                    else {
                        console.log("newly solved already present");
                    }

                    
                }else {
                    let solved_doc_for_update= await solved_model.findById(_id);
                    console.log("creating new problem and updating...");
                    let problem_data={
                        problem_name:element.problem,
                        problem_href:element.problemLink,
                        site_name:"CodeChef"
                    };
                    console.log(element.problem+" not already exists in db");
                    let problem_doc=await Problems_model.collection.insertOne(problem_data);
                    console.log("problem inserted",problem_doc);
                    // console.log(problem_doc);
                    solved_doc_for_update.codechef_solved.push((problem_doc.insertedId));
                    let data=await solved_doc_for_update.save();
                    console.log("recieved:",data);
                }
            });







            //  ________________________________________________________________________________________________
             //spoj newly solved problems
             let spnewlysolved=await this.updatespoj(spoj_last_refreshed,spoj_handle);
             console.log("spnewlysolved",spnewlysolved[0]);
             console.log("splen:",spnewlysolved.length);
             spoj_last_refreshed=spnewlysolved[0]?.time;

             console.log("spoj_last_refreshed",spoj_last_refreshed);     
             if(spnewlysolved.length > 0 ){
                let solved_doc_for_update= await solved_model.findById(_id);
                solved_doc_for_update.spoj_last_refreshed=spoj_last_refreshed;
                await solved_doc_for_update.save();
            } 


            spnewlysolved.forEach(async (element) => {
                
                let problem_doc=await Problems_model.find({"problem_name":element.name});
                // console.log(problem_doc);
                if(problem_doc.length > 0 ){
                    let solved_doc_for_update= await solved_model.findById(_id);
                    //alredy have problem in db
                    // console.log(problem_doc[0]);
                    // console.log("user_id",_id)
                    // console.log("problem id",problem_doc[0]._id);
                    let already_reference_present=solved_doc_for_update.spoj_solved.find((ele)=>{ return ele.equals(problem_doc[0]._id); });
                    if(! already_reference_present){
                        console.log("the refernece not present now pushing it to solved");
                        solved_doc_for_update.spoj_solved.push((problem_doc[0]._id));
                        let data=await solved_doc_for_update.save();
                        // console.log("recieved:",data);
                    }
                    else {
                        console.log("newly solved already present");
                    }

                    
                }else {
                    let solved_doc_for_update= await solved_model.findById(_id);
                    console.log("creating new problem and updating...");
                    let problem_data={
                        problem_name:element.name,
                        problem_href:element.link,
                        site_name:"Spoj"
                    };
                    console.log(element.name+" not already exists in db");
                    let problem_doc=await Problems_model.collection.insertOne(problem_data);
                    console.log("problem inserted",problem_doc);
                    // console.log(problem_doc);
                    solved_doc_for_update.spoj_solved.push((problem_doc.insertedId));
                    let data=await solved_doc_for_update.save();
                    console.log("recieved:",data);
                }
            });













            // // _______________________________________________________________________________________________________________
            //  hackerrank newly solved problems
            let hrnewlysolved=await this.updatehackerrank(hackerrank_last_refreshed,hackerrank_handle);
            console.log("hrnewlysolved",hrnewlysolved[0]);
            console.log("hrnewlysolved length",hrnewlysolved.length);
             hackerrank_last_refreshed=moment(hrnewlysolved[0]?.crecreated_at).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
             if(hrnewlysolved.length > 0 ){
                let solved_doc_for_update= await solved_model.findById(_id);
                solved_doc_for_update.hackerrank_last_refreshed=hackerrank_last_refreshed;
                await solved_doc_for_update.save();
            }
            
            hrnewlysolved.forEach(async (element) => {
                let problem_doc=await Problems_model.find({"problem_name":element.name});
                // console.log(problem_doc);
                if(problem_doc.length > 0 ){
                    let solved_doc_for_update= await solved_model.findById(_id);
                    //alredy have problem in db
                    // console.log(problem_doc[0]);
                    // console.log("user_id",_id)
                    // console.log("problem id",problem_doc[0]._id);
                    let already_reference_present=solved_doc_for_update.hackerrank_solved.find((ele)=>{ return ele.equals(problem_doc[0]._id); });
                    if(! already_reference_present){
                        console.log("the refernece not present now pushing it to solved");
                        solved_doc_for_update.hackerrank_solved.push((problem_doc[0]._id));
                        let data=await solved_doc_for_update.save();
                        // console.log("recieved:",data);
                    }
                    else {
                        console.log("newly solved already present");
                    }

                    
                }else {
                    let solved_doc_for_update= await solved_model.findById(_id);
                    console.log("creating new problem and updating...");
                    let problem_data={
                        problem_name:element.name,
                        problem_href:element.url,
                        site_name:"HackerRank"
                    };
                    console.log(element.name+" not already exists in db");
                    let problem_doc=await Problems_model.collection.insertOne(problem_data);
                    console.log("problem inserted",problem_doc);
                    // console.log(problem_doc);
                    solved_doc_for_update.hackerrank_solved.push((problem_doc.insertedId));
                    let data=await solved_doc_for_update.save()
                    

                    console.log("recieved:",data);
                }
            });


        console.log("hackerrank_last_refreshed",hackerrank_last_refreshed); 
        this.updates_scores();
        return "updated";
        }catch(err){
            console.log(err)
            console.log("error in Process_scores_method");
            return "error";
        }
    }


    async updates_scores(){
        try{
            let rollno=this.rollno;
        let codechef_handle=this.codechef_handle;
        let codeforces_handle=this.codeforces_handle;
        let hackerrank_handle=this.hackerrank_handle;
        let spoj_handle=this.spoj_handle;
        let leetcode_handle=this.leetcode_handle;

        let solved_data=await solved_model.find({roll_no:rollno});

        let Codechefclass=require("./codechef");
        let codechef_obj=new Codechefclass(codechef_handle);
        let codechef_data=await codechef_obj.get_credentials();
        // console.log(codechef_data);

        let codeforces=require("./codeforces");
        let codeforces_obj=new codeforces(codeforces_handle);
        let codeforces_data=await codeforces_obj.fetchProfile();
        // console.log(codeforces_data);

        let spoj=require("./spoj");
        let spoj_obj=new spoj(spoj_handle);
        let spoj_data=await spoj_obj.get_stats();
        // console.log(spoj_data);

        let leeetcode=await axios.get(`http://localhost:8800/leetcode/${leetcode_handle}`);
        let leetcode_data=(leeetcode.data);
        // console.log(leetcode_data);

        let tracked_scores_data=await tracked_scores_model.find({roll_no:rollno});
        tracked_scores_data=await tracked_scores_model.findById(tracked_scores_data[0]._id);

        tracked_scores_data.lc_solved=leetcode_data.totalSolved;
        tracked_scores_data.cc_solved=codechef_data.problemsSolved;
        tracked_scores_data.cf_solved=codeforces_data.problems_solved;
        tracked_scores_data.spoj_solved=parseInt(spoj_data.Problems_solved);
        tracked_scores_data.hr_solved=solved_data[0].hackerrank_solved.length;
        // console.log(solved_data[0].hackerrank_solved.length);

        tracked_scores_data.cc_rating=codechef_data.currentRating;
        tracked_scores_data.cf_rating=codeforces_data.rating;
        console.log(tracked_scores_data);   

        let update_response=await tracked_scores_data.save();
        console.log(update_response);

        return "score tracker updated";
        }catch(err){
            console.log(err);
        }
        



    }
}



async function mainf(){
    console.log("Inside mainf");
    let Process_obj=new Process_scores({
        rollno:"21r21a3333",
        codechef:"m_2002for2025",
        codeforces:"d.2002pullstop",
        hackerrank:"21r21a3333",
        spoj:"bhargavdh5",
        leetcode:"diwakar917736"
    });
    let data=await Process_obj.Process_scores_method();
     console.log(data);  
}


module.exports=mainf;
