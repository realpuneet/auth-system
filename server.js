require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");
const redisClient = require("./src/services/redisClient");


connectDB();
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
