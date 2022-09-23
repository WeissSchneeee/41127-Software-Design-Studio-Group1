const express = require ("express");
const router = express.Router();
const connection = require("../../index.js").connection;

router.post("/", async (req, res) => {
    try{
        const {userID} = req.body;
        let enrollments = await getEnrollmentList(userID);
        const list = [];
        for(let i = 0; i < enrollments.length; ++i){
            const data = enrollments[i];
            let censusDate = new Date(data.census_date);
            censusDate = new Date(censusDate.getTime() - (censusDate.getTimezoneOffset() * 6000)).toLocaleDateString('en-AU', {day: "numeric", month: "short", year: "numeric"});
            const subject = await getSubjectDetails(data.subject_id);
            const enrollment = {
                enrollment_id: data.enrollment_id,
                enrollment_date: data.enrollment_date,
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
            list.push(enrollment);
        }
        return res.status(200).json({
            status: true,
            enrollment: list
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

const getEnrollmentList = (userID) => {
    const date = new Date();
    const year = date.getFullYear();
    const sql = `SELECT * FROM enrollment e, session s WHERE e.student_id = '${userID}' AND e.session_id = s.session_id AND s.year >= ${year};`;
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