const express = require ("express");
const router = express.Router();
const connection = require("../../index.js").connection;

router.post("/", async (req, res) => {
    try{
        const {userID} = req.body;
        let enrolments = await getEnrolmentList(userID);
        const list = [];
        for(let i = 0; i < enrolments.length; ++i){
            const data = enrolments[i];
            let censusDate = new Date(data.census_date);
            censusDate = new Date(censusDate.getTime() - (censusDate.getTimezoneOffset() * 6000)).toLocaleDateString('en-AU', {day: "numeric", month: "short", year: "numeric"});
            const subject = await getSubjectDetails(data.subject_id);
            const enrolment = {
                enrolment_id: data.enrolment_id,
                enrolment_date: data.enrolment_date,
                status: data.status,
                student_id: data.student_id,
                subject_id: data.subject_id,
                subject_name: subject.subject_name,
                scredit_points: subject.scredit_points,
                session_id: data.session_id,
                type: data.type,
                year: data.year,
                census_date: censusDate
            };
            list.push(enrolment);
        }
        return res.status(200).json({
            status: true,
            enrolment: list
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

const getEnrolmentList = (userID) => {
    const date = new Date();
    const year = date.getFullYear();
    const sql = `SELECT * FROM enrolment e, session s WHERE e.student_id = '${userID}' AND e.session_id = s.session_id AND s.year >= ${year};`;
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

const getSubjectDetails = (subjectID) => {
    const sql = `SELECT * FROM subject WHERE subject_id = '${subjectID}';`;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if(err){
                console.log(err);
                return reject(null);
            }else{
                return resolve(result.rows[0]);
            }
        });
    });
};