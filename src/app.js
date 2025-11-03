const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth.route");
const adminRouter = require("./routes/admin.route");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use("/api/auth", authRouter);
app.use("/api/auth/admin", adminRouter);


app.get("/",(req,res)=>{
    res.send("Auth system API is running...");
})

module.exports = app;
