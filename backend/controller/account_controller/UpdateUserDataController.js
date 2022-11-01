const express = require ("express");
const router = express.Router();
const connection = require("../../index.js").connection;

router.post("/", async (req, res) => {
    try{
        const {userID, password, validationPass, firstName, lastName, contactNumber, dob} = req.body;
        
        let user = await getUserData(userID);
        user = user[0];
        // Check Password
        if(String(user.password) != String(validationPass)){
            console.log("Incorrect Validation Paassword!");
            return res.status(400).json({
                status: false,
                message: "Incorrect validation password!"
            });
        }
        // Update User on Database
        const affectedUser = await updateUserData(userID, password, firstName, lastName, contactNumber);
        if(affectedUser != 1){
            console.log("Error founded during user data modification process!");
            return res.status(400).json({
                status: false,
                message: "Error founded during user data modification process!"
            });
        }
        let specialInfo;
        if(String(user.user_type).toLowerCase() === "s"){
            const affectedStudent = await updateStudentData(userID, dob);
            if(affectedStudent != 1){
                console.log("Error founded during user data modification process!");
                return res.status(400).json({
                    status: false,
                    message: "Error founded during user data modification process!"
                });
            }
            specialInfo = await getStudentData(userID);
        }
        user.password = password;
        user.first_name = firstName;
        user.last_name = lastName;
        user.contact_number = contactNumber;
        console.log(`User data for id: ${userID} successfully updated!`);
        return res.status(200).json({
            status: true,
            message: "Profile successfully updated!",
            user: user,
            specialInfo: specialInfo
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
const updateUserData = (userID, password, firstName, lastName, contactNumber) => {
    const sql = `UPDATE user_t set password = '${password}', first_name = '${firstName}', last_name = '${lastName}', contact_number = '${contactNumber}' WHERE user_id = '${userID}';`;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if(err){
                console.log(err);
                return reject(true);
            }else{
                return resolve(result.rowCount);
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
const updateStudentData = (userID, dob) => {
    const sql = `UPDATE student set date_of_birth = '${dob}' WHERE student_id = '${userID}';`;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if(err){
                console.log(err);
                return reject(true);
            }else{
                return resolve(result.rowCount);
            }
        });
    });
};