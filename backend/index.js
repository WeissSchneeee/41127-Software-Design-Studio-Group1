const express = require("express");
const path = require('path');
require("dotenv").config();

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());

// CONNECTION TO HEROKU POSTGRESQL DATABASE
const { Client } = require("pg");
const { db } = require('./db');
const connection = new Client(db);

connection.connect((err) => {
    if (err) console.log(err);
    else console.log("Connected to database!");
});

const addErrorLog = async (prefix, message) => {
    let ts = Math.floor((Date.now()) / 1000)
    const sql = `insert into sys_log(time, prefix, message) values ($1,$2,$3)`
    await connection.query(sql, [ts, prefix, message], (err, result) => {
        if (err) {
            console.log(err);
        }
    });
}
module.exports = { connection, addErrorLog }

// ACCOUNT CONTROLLER APIs
app.use("/api/signin", require("./controller/account_controller/SignInController"));
app.use("/api/authenticatelogin", require("./controller/account_controller/AuthenticateLoginController"));
app.use("/api/getprofile", require("./controller/account_controller/GetProfileController"));
app.use("/api/updateuser", require("./controller/account_controller/UpdateUserDataController"));
app.use("/api/deleteuser", require("./controller/account_controller/DeleteUserController"));
app.use("/api/getalluser", require("./controller/account_controller/GetAllUserController"));
app.use("/api/createuser", require("./controller/account_controller/CreateUserController"));
app.use("/api/deletemultipleuser", require("./controller/account_controller/DeleteMultipleUserController"));
app.use("/api/forgetpassword", require("./controller/account_controller/ForgetPasswordController"));

//COURSE Controller
app.use("/api/course/list", require("./controller/couse_controller/CourseListController"));
app.use("/api/course/detail", require("./controller/couse_controller/CourseDetailController"));
app.use("/api/course/create", require("./controller/couse_controller/CourseCreateController"));
app.use("/api/course/update", require("./controller/couse_controller/CourseUpdateController"));
app.use("/api/course/delete", require("./controller/couse_controller/CourseDeleteController"));

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

app.on('error', (err) => {
    addErrorLog('app error', JSON.stringify(err))
    console.log(err.message);
});
