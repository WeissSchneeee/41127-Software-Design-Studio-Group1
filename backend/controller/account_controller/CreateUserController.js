const express = require ("express");
const router = express.Router();
const connection = require("../../index.js").connection;

router.post("/", async (req, res) => {
    try{
        const {accountType, email, password, firstName, lastName, contactNumber, role, dob} = req.body;
        // Check for existing email
        if(await isExisted("email_address", String(email).toLowerCase())){
            return res.status(400).json({
                status: false,
                message: "Email already exists, please choose another email!"
            });
        }
        // Create new account
        const user = await createAccount(accountType, email, password, firstName, lastName, contactNumber, role, dob);
        if(!user){
            return res.status(400).json({
                status: false,
                message: "Failed to create new user!"
            });
        }
        return res.status(200).json({
            status: true,
            user: user,
            message: "Successfully created new user!"
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

const createAccount = async (accountType, email, password, firstName, lastName, contactNumber, role, dob) => {
    try{
        const userID = await generateID(accountType);
        const user = {
            user_id: String(userID).toUpperCase(),
            email_address: String(email).toLowerCase(),
            password: password,
            first_name: firstName,
            last_name: lastName,
            contact_number: contactNumber,
            user_type: (String(accountType).toLowerCase() === 'a') ? "System Admin" : (String(accountType).toLowerCase() === 'e' ? "Staff" : "Student"),
            role: (String(accountType).toLowerCase() === 's') ? "Student" : role,
            dob: new Date(dob).toLocaleDateString('en-AU', {day: "numeric", month: "short", year: "numeric"})
        };
        const sql  = `INSERT INTO user_t VALUES ('${user.user_id}', '${user.email_address}', '${password}', '${user.first_name}', '${user.last_name}', '${user.contact_number}', '${accountType}');`;
        return new Promise((resolve, reject) => {
            connection.query(sql, async (err, result) => {
                if(err){
                    return reject(null);
                }else{
                    console.log(`Account: ${user.user_id} successfully created!`);
                    switch(accountType){
                        case "a":
                            await createAdmin(user.user_id, role);
                            break;
                        case "e":
                            await createStaff(user.user_id, role);
                            break;
                        default:
                            await createStudent(user.user_id, dob);
                            break;
                    }
                    return resolve(user);
                }
            });
        });
    }catch(error){
        console.log(error);
    }
};
const createAdmin = (userID, role) => {
    const sql = `INSERT INTO system_admin VALUES ('${userID}', '${role}');`;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if(err){
                console.log(err);
                return reject(null);
            }else{
                return resolve(result);
            }
        });
    });
};
const createStaff = (userID, role) => {
    const sql = `INSERT INTO staff VALUES ('${userID}', '${role}');`;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if(err){
                console.log(err);
                return reject(null);
            }else{
                return resolve(result);
            }
        });
    });
};
const createStudent = (userID, dob) => {
    const sql = `INSERT INTO student VALUES ('${userID}', '${dob}');`;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if(err){
                console.log(err);
                return reject(null);
            }else{
                return resolve(result);
            }
        });
    });
};
const generateID = async (accountType) => {
    const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
    const characters = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m"];
    // User ID format: UCCNNCCNNN
    let userID;
    do{
        userID = String(accountType).toUpperCase() + characters[randomNumber(26)] + characters[randomNumber(26)] + numbers[randomNumber(10)] + numbers[randomNumber(10)] + characters[randomNumber(26)] + characters[randomNumber(26)] + numbers[randomNumber(10)] + numbers[randomNumber(10)] + numbers[randomNumber(10)];
        userID = String(userID).toUpperCase();
    }while(await isExisted("user_id", userID));
    return userID;
};
const isExisted = (field, data) => {
    const sql = `SELECT * FROM user_t WHERE ${field} = '${String(data)}';`;
    
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if(err){
                console.log(err);
                return reject(true);
            }else{
                return resolve(result.rows.length > 0);
            }
        });
    });
};
const randomNumber = (n) => {
    return Math.floor(Math.random() * n);
};