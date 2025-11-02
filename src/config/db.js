const mongoose = require("mongoose");

const connectDB = () => {
  mongoose.connect(process.env.MONGODB_URI).then(()=>{
    console.log("Db Connected");
    
  });
};

module.exports = connectDB;
