
const axios = require('axios');
const hackerrankstat=async (req,res)=>{
    try{
        res.send(data.test);
    }catch(err){
        res.json({error:err});
    }
}

module.exports={
    hackerrankstat
}