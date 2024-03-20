const { hackerrankstat } = require('../controllers/hackerrankcontroller');
const router = require('express').Router();
const Hackerrankclass = require('../modules/sites/hackerrank');
const moment=require('moment');


router.get("/:handle", async(req, res) => {
    let handle = req.params.handle;
    let obj = new Hackerrankclass(handle);
    let data = await obj.get_submissions(moment('2024-03-05 12:00:00'));
    res.send(data);
}); 

router.get('/', (req,res)=>{
    res.send('Hackerrank');
});
module.exports = router;