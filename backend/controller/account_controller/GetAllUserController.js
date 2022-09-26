const express = require ("express");
const router = express.Router();
const connection = require("../../index.js").connection;

router.post("/", async (req, res) => {
    try{
        const {userID} = req.body;
        const sql = `SELECT * FROM user_t WHERE user_id != '${userID}';`;
        connection.query(sql, async (err, result) => {
            if(err){
                console.log(err);
                return res.status(400).json({
                    status: false,
                    message: err
                });
            }else{
                const users = [];
                const readData = async (users) => {
                    for(let i = 0; i < result.rows.length; ++i){
                        const data = result.rows[i];
                        const userID = String(data.user_id).toUpperCase();
                        const uniqueData = (String(data.user_type).toLowerCase() === 'a') ? await getAdminData(userID) : 
                                            ((String(data.user_type).toLowerCase() === 'e') ? await getStaffData(userID) : await getStudentData(userID));
                        let dob = (String(data.user_type).toLowerCase() === 's') ? new Date(uniqueData.date_of_birth) : new Date();
                        dob = new Date(dob.getTime() - (dob.getTimezoneOffset() * 60000)).toLocaleDateString('en-AU', {day: "numeric", month: "short", year: "numeric"});
                        const user = {
                            user_id: userID,
                            email_address: String(data.email_address).toLowerCase(),
                            password: data.password,
                            first_name: data.first_name,
                            last_name: data.last_name,
                            contact_number: data.contact_number,
                            user_type: (String(data.user_type).toLowerCase() === 'a') ? "System Admin" : (String(data.user_type).toLowerCase() === 'e' ? "Staff" : "Student"),
                            role: (String(data.user_type).toLowerCase() === 'a' || String(data.user_type).toLowerCase() === 'e') ? uniqueData.role : "Student",
                            dob: dob
                        };
                        users.push(user);
                    }
                };
                await readData(users);
                return res.status(200).json({
                    status: true,
                    users: users
                });
            }
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

const getAdminData = (userID) => {
    const sql = `SELECT * FROM system_admin WHERE admin_id = '${userID}';`;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if(err){
                console.log(err);
                return reject(true);
            }else{
                return resolve(result.rows[0]);
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
                return reject(true);
            }else{
                return resolve(result.rows[0]);
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
                return reject(true);
            }else{
                return resolve(result.rows[0]);
            }
        });
    });
};