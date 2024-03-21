const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
//dbconnect
const {databaseconnect}=require("./dbconfig");

const ccrouter = require('./router/codechefscores');
const lcrouter = require('./router/leetcodescores');
const hrrouter = require('./router/hackerrankscore');
const spojrouter = require('./router/spojscores');
const codeforcesrouter = require('./router/codeforcesscore');
const regisrationrouter = require('./router/registration/register');

// dbconnection
databaseconnect();


// cors
app.use(cors({
    origin: '*'
}))
// parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true ,limit: '50mb' }));

// routes
app.get('/',(req,res)=>{
    res.send("Welcome to the server");
})
app.use('/codechef',ccrouter);
app.use('/leetcode',lcrouter);
app.use('/hackerrank',hrrouter);
app.use('/spoj',spojrouter);
app.use('/codeforces',codeforcesrouter);
app.use('/register',regisrationrouter);



app.use((err, req, res, next) => {
    console.error(err.stack); 
    res.status(err.status || 500).json({
      error: {
        message: err.message || 'Internal Server Error'
      }
    });
  });

const PORT = process.env.PORT || 8800;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});