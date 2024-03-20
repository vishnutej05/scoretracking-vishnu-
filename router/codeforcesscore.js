const router = require('express').Router();
const codeforcesclass = require('../modules/sites/codeforces');
const moment = require('moment');

router.use('/:handle',async (req,res)=>{
    let handle = req.params.handle;
    let obj = new codeforcesclass(handle);
    // for now retrieving submissions before 2024-03-05 12:00:00
    let data = await obj.fetchSubmissions(moment('2024-03-05 12:00:00'));
    res.send(data);
} );
router.get('/', (req, res) => { 
    res.send('codeforcescore home page');
});

module.exports = router;