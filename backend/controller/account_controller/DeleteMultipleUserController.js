const express = require ("express");
const router = express.Router();
const connection = require("../../index.js").connection;

router.post("/", async (req, res) => {
    try{
        const {list} = req.body;
        for(let i = 0; i < list.length; ++i){
            const userID = list[i];
            let user = await getUserData(userID);
            user = user[0];
            let affectedSpecificUser;
            switch(String(user.user_type).toLowerCase()){
                case "a":
                    affectedSpecificUser = await deleteAdmin(userID);
                    break;
                case "e":
                    affectedSpecificUser = await deleteStaff(userID);
                    break;
                case "s":
                    affectedSpecificUser = await deleteStudent(userID);
                    break;
            }
            if(affectedSpecificUser != 1){
                console.log("Error founded during user deletion process!");
                return res.status(400).json({
                    status: false,
                    message: "Error founded during user deletion process!"
                });
            }
            let affectedUser = await deleteUser(userID);
            if(affectedUser != 1){
                console.log("Error founded during user deletion process!");
                return res.status(400).json({
                    status: false,
                    message: "Error founded during user deletion process!"
                });
            }
            console.log(`User id: ${userID} successfully deleted!`);
        }
        return res.status(200).json({
            status: true,
            message: "Account successfully deleted!"
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
const deleteAdmin = (userID) => {
    const sql = `DELETE FROM system_admin WHERE admin_id = '${userID}';`;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if(err){
                console.log(err);
                return reject(null);
            }else{
                return resolve(result.rowCount);
            }
        });
    });
};
const deleteStaff = (userID) => {
    const sql = `DELETE FROM staff WHERE staff_id = '${userID}';`;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if(err){
                console.log(err);
                return reject(null);
            }else{
                return resolve(result.rowCount);
            }
        });
    });
};
const deleteStudent = (userID) => {
    const sql = `DELETE FROM student WHERE student_id = '${userID}';`;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if(err){
                console.log(err);
                return reject(null);
            }else{
                return resolve(result.rowCount);
            }
        });
    });
};
const deleteUser = (userID) => {
    const sql = `DELETE FROM user_t WHERE user_id = '${userID}';`;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if(err){
                console.log(err);
                return reject(null);
            }else{
                return resolve(result.rowCount);
            }
        });
    });
}