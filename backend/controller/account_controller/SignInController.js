const express = require("express");
const router = express.Router();
const connection = require("../../index.js").connection;
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post("/", async (req, res) => {
    try{
        const {email, password, rememberMe} = req.body;
        let user = await getUser(email);
        user = user[0];

        // Check email input
        if(!user){
            console.log("Invalid email address!");
            return res.status(400).json({
                status: false,
                message: "Invalid email address and/or password!"
            });
        }

        // Check password input
        if(String(user.password) !== String(password)){
            console.log("Invalid password");
            return res.status(400).json({
                status: false,
                message: "Invalid email address and/or password!"
            });
        }

        // Generate token and save the token
        const userID = user.user_id;
        let loginToken;
        if(rememberMe)
            loginToken = jwt.sign(JSON.parse(`{"userID":"${userID}"}`), process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });
        else
            loginToken = jwt.sign(JSON.parse(`{"userID":"${userID}"}`), process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
        console.log(`${user.email_address} successfully login to his/her account!`);
        return res.status(200).json({
            status: true,
            message: "Log In Successfull!",
            loginToken: loginToken
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

const getUser = (email) => {
    const sql = `SELECT * FROM user_t WHERE email_address = '${String(email).toLowerCase()}';`;

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