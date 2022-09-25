const express = require("express");
const { addErrorLog } = require("../../index.js");
const router = express.Router();
const connection = require("../../index.js").connection;

router.post("/", async (req, res) => {
    try {
        const { last_id, subject_id, subject_name, pre_requisites, core_subjects, anti_requisites, co_requisites, scredit_points, subject_descriptions, subject_level, electives, subjectFees } = req.body;

        // create new
        const inserted = await update(last_id, subject_id, subject_name, pre_requisites, core_subjects, anti_requisites, co_requisites, scredit_points, subject_descriptions, subject_level, electives, subjectFees);
        if (!inserted) {
            return res.status(400).json({
                status: false,
                message: "Failed to update subject!"
            });
        }
        return res.status(200).json({
            status: true,
            newid: inserted.newID,
            message: "Successfully update new subject!"
        });
    } catch (error) {
        console.log(error);
        addErrorLog(req.originalUrl + "", JSON.stringify(error))
        return res.status(400).json({
            status: false,
            message: error
        });
    }
});
module.exports = router;

const update = async (last_id, subject_id, subject_name, pre_requisites, core_subjects, anti_requisites, co_requisites, scredit_points, subject_descriptions, subject_level, electives, subjectFees,) => {
    try {

        if (!subject_id) {
            return
        }

        const sql = `update subject set subject_id = $1, subject_name = $2, pre_requisites = $3, core_subjects = $4, anti_requisites = $5, co_requisites = $6, scredit_points = $7, subject_descriptions = $8, subject_level = $9, electives = $10, "subjectFees" = $11 where subject_id = $12`
        const newRow = [subject_id, subject_name, pre_requisites, core_subjects, anti_requisites, co_requisites, scredit_points, subject_descriptions, subject_level, electives, subjectFees, last_id]
        return new Promise((resolve, reject) => {
            connection.query(sql, newRow, async (err, result) => {
                if (err) {
                    console.log('err', err)
                    return reject(null);
                } else {
                    console.log(`Course: ${subject_id} successfully created!`);
                    return resolve({ subject_id: subject_id, subject_name: subject_name });
                }
            });
        });
    } catch (error) {
        console.log(error);
        addErrorLog(req.originalUrl + "_update", JSON.stringify(error))
    }
};

const isExisted = (field, data) => {
    const sql = `SELECT * FROM course WHERE ${field} = $1`;

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