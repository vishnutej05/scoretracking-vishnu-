const mongoose = require("mongoose");
require("dotenv").config();
// const {MONGO_URL}=require("./config")
async function databaseconnect() {
  try {
    console.log("trying to connect");
    let data = await mongoose.connect(process.env.MONGO_URL);
    console.log("connected to mongo");
  } catch (err) {
    console.log(err);
  }
}
module.exports = { databaseconnect };
