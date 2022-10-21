const express = require("express");
const router = express.Router();
const connection = require("../../index.js").connection;
const nodemailer = require("nodemailer");
require ("dotenv").config();

router.post("/", async (req, res) => {
    try{
        const {email} = req.body;
        let user = await getUser(email);
        user = user[0];
        // Check email input
        if(!user){
            return res.status(400).json({
                status: false,
                message: "Unregistered email address"
            });
        }
        sendEmail(String(email).toLowerCase(), user.password);
        return res.status(200).json({
            status: true,
            message: "Please check your email's inbox!"
        });
    }catch(error){
        res.send("error");
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
const sendEmail = (email, password) => {
    try{
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: 'anjelin0707@gmail.com',
                pass: 'hyvesiyfbnmfndpk',
            },
        });
        const mailContent = {
            from: "anjelin0707@gmail.com",
            to: email,
            subject: "Subject Recommendation Forget Password",
            html: `The password for account: ${email} is '${password}'.`
        };
        transporter.sendMail(mailContent, (error, info) => {
            if(error)
                console.log(error);
            else
                console.log(info.response);
        });
    }catch(error){
        console.log(error);
    }
};