const { hackerrankstat } = require('../controllers/hackerrankcontroller');
const router = require('express').Router();



router.get('/', hackerrankstat);
module.exports = router;