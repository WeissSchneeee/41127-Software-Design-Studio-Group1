const express = require("express");
const router = express.Router();
const connection = require("../../index.js").connection;

router.post("/", async (req, res) => {
    try{
        const {userID} = req.body;
        const enrolmentOption = await getEnrolmentOption(userID);
        return res.status(200).json({
            status: true,
            subject: enrolmentOption
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

const getEnrolmentOption = (userID) => {
    const sql = `SELECT * FROM subject WHERE subject_id NOT IN (
        SELECT subject_id FROM enrolment WHERE student_id = '${userID}' AND status != 'f'
    ) ORDER BY subject_id;`;
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