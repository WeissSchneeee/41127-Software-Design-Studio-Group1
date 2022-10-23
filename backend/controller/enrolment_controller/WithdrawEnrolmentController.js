const express = require ("express");
const router = express.Router();
const connection = require("../../index.js").connection;

router.post("/", async (req, res) => {
    try{
        const {list} = req.body;
        for(let i = 0; i < list.length; ++i){
            const enrolmentID = list[i];
            const affectedEnrolment = await deleteEnrolment(enrolmentID);
            if(affectedEnrolment != 1){
                console.log("Error founded during enrolment deletion process!");
                return res.status(400).json({
                    status: false,
                    message: "Error founded during enrolment deletion process!"
                });
            }
            console.log(`Enrolment id: ${enrolmentID} successfully deleted!`);
        }
        return res.status(200).json({
            status: true,
            message: "Enrolment(s) successfully deleted!"
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

const deleteEnrolment = (enrolmentID) => {
    const sql = `DELETE FROM enrolment WHERE enrolment_id = '${enrolmentID}';`;
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