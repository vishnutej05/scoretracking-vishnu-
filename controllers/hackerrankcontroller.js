
const axios = require('axios');
const hackerrankstat=async (req,res)=>{
    try{
        let data = await axios.get(`https://www.hackerrank.com/profile/bhargavdh5`);
        res.send(data.data);
    }catch(err){
        res.json({error:err});
    }
}

module.exports={
    hackerrankstat
}