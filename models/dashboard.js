const mongoose = require("mongoose");

const dashboardSchema = new mongoose.Schema({
  roll_no: {
    type: String,
    unique: true,
    required: true,
  },
  user_name: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
  },
  dob: {
    type: String,
  },
  gender: {
    type: String,
  },
  about_me: {
    type: String,
  },
  building: {
    type: String,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  street: {
    type: String,
  },
  postal_code: {
    type: String,
  },
  fb_handle: {
    type: String,
  },
  twitter_handle: {
    type: String,
  },
  insta_handle: {
    type: String,
  },
  linkedin_handle: {
    type: String,
  },
  github: {
    type: String,
  },
});

dashboardSchema.index({ roll_no: 1 });
const dashboard = mongoose.model("dashboard", dashboardSchema);
module.exports = dashboard;
