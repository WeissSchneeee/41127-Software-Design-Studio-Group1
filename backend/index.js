const express = require("express");
const path = require('path');
require ("dotenv").config();

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());

// CONNECTION TO HEROKU POSTGRESQL DATABASE
const {Client} = require("pg");
const connection = new Client({
    host: "ec2-34-207-12-160.compute-1.amazonaws.com",
    user: "fkqtzcrjkybizb",
    port: 5432,
    password: "041098df80146c8615cd856429f37d05afe722c42b88f5b728f790f4c6462746",
    database: "d5daga22vac1v1",
    ssl: {
        rejectUnauthorized: false
    }
});
connection.connect((err) => {
    if(err) console.log(err);
    else console.log("Connected to database!");
});
exports.connection = connection;

// ACCOUNT CONTROLLER APIs
app.use("/api/signin", require("./controller/account_controller/SignInController"));
app.use("/api/authenticatelogin", require("./controller/account_controller/AuthenticateLoginController"));
app.use("/api/getprofile", require("./controller/account_controller/getProfileController"));
app.use("/api/updateuser", require("./controller/account_controller/UpdateUserDataController"));
app.use("/api/deleteuser", require("./controller/account_controller/DeleteUserController"));
app.use("/api/getalluser", require("./controller/account_controller/GetAllUserController"));
app.use("/api/createuser", require("./controller/account_controller/CreateUserController"));
app.use("/api/deletemultipleuser", require("./controller/account_controller/DeleteMultipleUserController"));

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

app.on('error', (err) => {
    console.log(err.message);
 });