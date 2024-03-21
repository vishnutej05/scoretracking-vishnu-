const axios=require("axios");   
const Codechefclass=require("../../modules/sites/codechef");
const Codeforcesclass = require("../../modules/sites/codeforces");
const Hackerrankclass = require("../../modules/sites/hackerrank");
const Spojclass = require("../../modules/sites/spoj");

const express=require("express");
const router=express.Router();

const is_valid_profile=require("../../middlewares/is_valid_profile");

function is_profile_available(req,res,next){
    let body=req.body;
    if(body.rollno && body.codechef && body.codeforces && body.hackerrank && body.leetcode && body.spoj){
        // console.log(body);
        next();
    }
    else{
        res.status(400).send("Please fill all the details");
    }
}



router.get('/',async (req,res)=>{
    res.send("registration page");
})
router.post('/',is_profile_available,is_valid_profile,async (req,res)=>{ 
    let body=req.body;
    res.send(body);
});
module.exports=router;