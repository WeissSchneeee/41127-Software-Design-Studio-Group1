const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const connection = require("../../index.js").connection;
require ("dotenv").config();

router.post("/", async (req, res) => {
    try{
        const token = req.body.token;
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, data) => {
            if(err){
                return res.status(403).json({
                    userID: "none"
                });
            }
            const checkID = await isUserExist(data.userID);
            if(!checkID){
                return res.status(403).json({
                    userID: "none"
                });
            }
            return res.status(200).json({
                userID: data.userID
            });
        });
    }catch(error){
        console.log(error);
        return res.status(403).json({
            userID: "none"
        });
    }
});
module.exports = router;

const isUserExist = (userID) => {
    const sql = `SELECT * FROM user_t WHERE user_id = '${userID}';`;
    
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if(err){
                console.log(err);
                return reject(null);
            }
            else{
                return resolve(result.rows);
            }
        });
    });
};