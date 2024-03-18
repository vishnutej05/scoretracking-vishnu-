const express = require('express')
const app = express();
const bodyParser = require('body-parser');

const ccrouter = require('./router/codechefscores');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true ,limit: '50mb' }));


app.use('/codechef',ccrouter);

const PORT = process.env.PORT || 8800;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});