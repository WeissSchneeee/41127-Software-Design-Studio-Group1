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
    else console.log("Connected to database! ", db.host);
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
app.use("/api/getprofile", require("./controller/account_controller/getProfileController"));
app.use("/api/updateuser", require("./controller/account_controller/UpdateUserDataController"));
app.use("/api/deleteuser", require("./controller/account_controller/DeleteUserController"));
app.use("/api/getalluser", require("./controller/account_controller/GetAllUserController"));
app.use("/api/createuser", require("./controller/account_controller/CreateUserController"));
app.use("/api/deletemultipleuser", require("./controller/account_controller/DeleteMultipleUserController"));
app.use("/api/forgetpassword", require("./controller/account_controller/ForgetPasswordController"));

// COURSE CONTROLLER APIs
app.use("/api/course/list", require("./controller/couse_controller/CourseListController"));
app.use("/api/course/detail", require("./controller/couse_controller/CourseDetailController"));
app.use("/api/course/create", require("./controller/couse_controller/CourseCreateController"));
app.use("/api/course/update", require("./controller/couse_controller/CourseUpdateController"));
app.use("/api/course/delete", require("./controller/couse_controller/CourseDeleteController"));
app.use("/api/course/addsubject", require("./controller/couse_controller/CourseAddSubjectController"));
app.use("/api/course/deletesubject", require("./controller/couse_controller/CourseDeleteSubjectController"));

// SUBJECT CONTROLLER APIs
app.use("/api/subject/list", require("./controller/subject_controller/SubjectListController"));
app.use("/api/subject/detail", require("./controller/subject_controller/SubjectDetailController"));
app.use("/api/subject/create", require("./controller/subject_controller/SubjectCreateController"));
app.use("/api/subject/update", require("./controller/subject_controller/SubjectUpdateController"));
app.use("/api/subject/delete", require("./controller/subject_controller/SubjectDeleteController"));

//ANNOUNCEMENT CONTROLLER APIs
app.use("/api/announcement/list", require("./controller/announcement_controller/announcementListController"));
app.use("/api/announcement/create", require("./controller/announcement_controller/announcementCreateController"));
app.use("/api/announcement/delete", require("./controller/announcement_controller/announcementDeleteController"));
app.use("/api/announcement/detail", require("./controller/announcement_controller/announcementDetailController"));

// ENROLMENT CONTROLLER APIs
app.use("/api/getenrolmentlist", require("./controller/enrolment_controller/GetStudentEnrolmentController"));
app.use("/api/withdrawenrolment", require("./controller/enrolment_controller/WithdrawEnrolmentController"));
app.use("/api/enrolment/sendinfo", require("./controller/enrolment_controller/SendInfoEnrolmentController"));

// SYS LOG CONTROLLER APIs
app.use("/api/syslog/list", require("./controller/syslog_controller/SyslogListController"));
app.use("/api/syslog/delete", require("./controller/syslog_controller/SyslogDeleteController"));

// E REQUEST CONTROLLER APIs
app.use("/api/erequest/list", require("./controller/erequest_controller/ErequestListController"));
app.use("/api/erequest/create", require("./controller/erequest_controller/ErequestCreateController"));
app.use("/api/erequest/detail", require("./controller/erequest_controller/ErequestDetailController"));
app.use("/api/erequest/updateanswer", require("./controller/erequest_controller/ErequestUpdateAnswerController"));
app.use("/api/erequest/delete", require("./controller/erequest_controller/ErequestDeleteController"));
app.use("/api/erequest/file", require("./controller/erequest_controller/ErequestFileController"));

// SESSION CONTROLLER APIs
app.use("/api/getsession", require("./controller/session_controller/GetSessionController"));
app.use("/api/getsessionlist", require("./controller/session_controller/GetSessionListController"));
app.use("/api/createsession", require("./controller/session_controller/CreateSessionController"));
app.use("/api/updatesession", require("./controller/session_controller/UpdateSessionController"));
app.use("/api/deletesession", require("./controller/session_controller/DeleteSessionController"));

//recommendation APIs
app.use("/api/KNN", require("./controller/KNN_controller/pyScriptController"));

// CONNECTION TO FRONTEND BUILD
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

app.on('error', (err) => {
    // addErrorLog('app error', JSON.stringify(err))
    console.log(err.message);
});
