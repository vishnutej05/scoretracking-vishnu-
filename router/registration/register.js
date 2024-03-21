const express=require("exress");
const router=express.Router();

router.get('/',async (req,res)=>{
    res.send("registraion page")
})
module.exports=router;