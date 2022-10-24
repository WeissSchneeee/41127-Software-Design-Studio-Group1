const express = require ("express");
const router = express.Router();
const connection = require("../../index.js").connection;

router.post("/", async (req, res) => {
    try{
        const {userID, subjectID} = req.body;
        const enrolment = await createEnrolment(userID, subjectID, "STD77LE679");
        if(!enrolment){
            return res.status(400).json({
                status: false,
                message: "Failed to create new enrolment!"
            });
        }
        return res.status(200).json({
            status: true,
            enrolment: enrolment,
            message: "Successfully enroled subject!"
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

const createEnrolment = async (userID, subjectID, sessionID) => {
    try{
        const enrolmentID = await generateID();
        let date = new Date();
        date = (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getFullYear();
        const enrolment = {
            enrolment_id: String(enrolmentID).toUpperCase(),
            enrolment_date: date,
            status: "e",
            student_id: userID,
            subject_id: subjectID,
            session_id: sessionID
        };
        const sql = `INSERT INTO enrolment VALUES ('${enrolment.enrolment_id}', '${enrolment.enrolment_date}', '${enrolment.status}', '${enrolment.student_id}', '${enrolment.subject_id}', '${enrolment.session_id}');`;
        return new Promise((resolve, reject) => {
            connection.query(sql, async (err, result) => {
                if(err){
                    console.log(err);
                    return reject(null);
                }else{
                    console.log(`Enrolment: ${enrolmentID} successfully created!`);
                    return resolve(enrolment);
                }
            });
        });
    }catch(error){
        console.log(error);
    }
};
const generateID = async _ => {
    const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
    const characters = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m"];
    // User ID format: ECCNNCCNNN
    let enrolmentID;
    do{
        enrolmentID = 'E' + characters[randomNumber(26)] + characters[randomNumber(26)] + numbers[randomNumber(10)] + numbers[randomNumber(10)] + characters[randomNumber(26)] + characters[randomNumber(26)] + numbers[randomNumber(10)] + numbers[randomNumber(10)] + numbers[randomNumber(10)];
        enrolmentID = String(enrolmentID).toUpperCase();
    }while(await isIDExists(enrolmentID));
    return enrolmentID;
};
const isIDExists = (data) => {
    const sql = `SELECT * FROM enrolment WHERE enrolment_id = '${String(data)}';`;
    
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