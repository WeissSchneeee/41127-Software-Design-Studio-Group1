const express = require ("express");
const router = express.Router();
const connection = require("../../index.js").connection;

router.post("/", async (req, res) => {
    try{
        const {userID} = req.body;
        let user = await getUserData(userID);
        user = user[0];
        let specialData;
        switch(String(user.user_type).toLowerCase()){
            case "a":
                specialData = await getSystemAdminData(userID);
                break;
            case "e":
                specialData = await getStaffData(userID);
                break;
            case "s":
                specialData = await getStudentData(userID);
                const date = new Date(specialData[0].date_of_birth);
                specialData[0].date_of_birth = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
                break;
        }
        return res.status(200).json({
            status: true,
            user: user,
            specialData: specialData[0]
        });
    }catch(error){
        console.log(error);
        return res.status(400).json({
            status: false,
            message: error
        });
    }
});
module.exports = router;

const getUserData = (userID) => {
    const sql = `SELECT * FROM user_t WHERE user_id = '${userID}';`;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if(err){
                console.log(err);
                return reject(null);
            }else{
                return resolve(result.rows);
            }
        });
    });
};

const getSystemAdminData = (userID) => {
    const sql = `SELECT * FROM system_admin WHERE admin_id = '${userID}';`;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if(err){
                console.log(err);
                return reject(null);
            }else{
                return resolve(result.rows);
            }
        });
    });
};

const getStaffData = (userID) => {
    const sql = `SELECT * FROM staff WHERE staff_id = '${userID}';`;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if(err){
                console.log(err);
                return reject(null);
            }else{
                return resolve(result.rows);
            }
        });
    });
};

const getStudentData = (userID) => {
    const sql = `SELECT * FROM student WHERE student_id = '${userID}';`;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if(err){
                console.log(err);
                return reject(null);
            }else{
                return resolve(result.rows);
            }
        });
    });
};