const express = require("express");
const { addErrorLog } = require("../../index.js");
const router = express.Router();
const connection = require("../../index.js").connection;

router.post("/", async (req, res) => {
    try {
        const { subject_id, subject_name, pre_requisites, core_subjects, anti_requisites, co_requisites, scredit_points, subject_descriptions, subject_level, electives, subjectFees, subjectQuiz, subjectIndiAssign, subjectGroupAssign, subjectExam, subjectPreRS } = req.body;

        // create new
        const inserted = await createNew(subject_id, subject_name, pre_requisites, core_subjects, anti_requisites, co_requisites, scredit_points, subject_descriptions, subject_level, electives, subjectFees, subjectQuiz, subjectIndiAssign, subjectGroupAssign, subjectExam, subjectPreRS);
        
        if (typeof (inserted.newID) === 'undefined') {
            return res.status(400).json({
                status: false,
                message: `Failed to create new subject!`
            });
        }
        return res.status(200).json({
            status: true,
            newid: inserted.newID,
            message: "Successfully created new subject!"
        });
    } catch (error) {
        console.log(error);
        addErrorLog(req.originalUrl + "", error.toString())
        return res.status(400).json({
            status: false,
            message: error.message
        });
    }
});
module.exports = router;

const createNew = async (subject_id, subject_name, pre_requisites, core_subjects, anti_requisites, co_requisites, scredit_points, subject_descriptions, subject_level, electives, subjectFees, subjectQuiz, subjectIndiAssign, subjectGroupAssign, subjectExam, subjectPreRS) => {
    try {

        if (!subject_id) {
            return "Please fill subject id!"
        }

        const sql = `insert into subject("subject_id", "subject_name", "pre_requisites", "core_subjects", "anti_requisites", "co_requisites", "scredit_points", "subject_descriptions", "subject_level", "electives", "subject_fees", "subject_quiz", "subject_indiassign", "subject_groupassign", "subject_exam", "subject_preq") values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11, $12, $13, $14, $15, $16);`
        const newRow = [subject_id, subject_name, pre_requisites, core_subjects, anti_requisites, co_requisites, scredit_points, subject_descriptions, subject_level, electives, subjectFees, subjectQuiz, subjectIndiAssign, subjectGroupAssign, subjectExam, subjectPreRS]
        
        return new Promise((resolve, reject) => {
            connection.query(sql, newRow, async (err, result) => {
                if (err) {
                    console.log('err', err)
                    return reject(err);
                } else {
                    console.log(`Subject: ${subject_id} successfully created!`);
                    return resolve({ newID: subject_id, subject_name: subject_name });
                }
            });
        });
    } catch (error) {
        addErrorLog(req.originalUrl + "_createnew", error.toString())
        console.log(error);
    }
};

const isExisted = (field, data) => {
    const sql = `SELECT * FROM subject WHERE ${field} = $1`;

    return new Promise((resolve, reject) => {
        connection.query(sql, [data], (err, result) => {
            if (err) {
                console.log(err);
                return reject(true);
            } else {
                return resolve(result.rows.length > 0);
            }
        });
    });
};