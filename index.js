const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const ccrouter = require('./router/codechefscores');
const lcrouter = require('./router/leetcodescores');
const hrrouter = require('./router/hackerrankscore');
// cors
app.use(cors({
    origin: '*'
}))
// parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true ,limit: '50mb' }));

// routes
app.use('/codechef',ccrouter);
app.use('/leetcode',lcrouter);
app.use('/hr',hrrouter);

const PORT = process.env.PORT || 8800;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});