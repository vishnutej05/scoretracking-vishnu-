const axios = require('axios');
const jsdom = require("jsdom");
const router = require('express').Router();
const { JSDOM } = jsdom;
const {
    codechefstats,
    cc_checkcontroller
}=require('../controllers/cccontroller');

router.get('/:handle', codechefstats);
router.get('/', cc_checkcontroller);

module.exports = router;    