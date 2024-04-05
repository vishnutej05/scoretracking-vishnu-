const Dashboard = require("../models/dashboard");
const Upload = require("../helpers/upload");

const uploadFile = async (req, res) => {
  try {
    const upload = await Upload.uploadFile(req.file.path);
    console.log(upload);

    const dashboard = await Dashboard.findOne({});

    // Update the profile field with the uploaded file URL
    dashboard.profile = upload.secure_url;

    // Save the updated dashboard document
    const updatedDashboard = await dashboard.save();

    res.send({
      success: true,
      msg: "File Uploaded Successfully!",
      data: updatedDashboard,
    });
  } catch (error) {
    res.send({ success: false, msg: error.message });
  }
};

module.exports = {
  uploadFile,
};

// make oit work with authentication it shoulkd fetch user with rollno and update
