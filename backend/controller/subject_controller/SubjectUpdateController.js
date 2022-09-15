const express = require("express");
const router = express.Router();
const connection = require("../../index.js").connection;

router.post("/", async (req, res) => {
    try {
        const { subject_id, subject_name, pre_requisites, core_subjects, anti_requisites, co_requisites, scredit_points, subject_descriptions, subject_level, electives, subject_fees, course_id } = req.body;
        
        // update
        const updated = await update(subject_id, subject_name, pre_requisites, core_subjects, anti_requisites, co_requisites, scredit_points, subject_descriptions, subject_level, electives, subject_fees, course_id);
        if (!updated) {
            return res.status(400).json({
                status: false,
                message: "Failed to update subject!"
            });
        }
        return res.status(200).json({
            status: true,
            subject_id: updated.subject_id,
            message: "Successfully update subject!"
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: false,
            message: error
        });
    }
});
module.exports = router;

const update = async (subject_id, subject_name, pre_requisites, core_subjects, anti_requisites, co_requisites, scredit_points, subject_descriptions, subject_level, electives, subject_fees, course_id) => {
    try {
        
        
        const sql = `UPDATE subject set subject_id = '${subject_id}', subject_name = '${subject_name}', pre_requisites = '${pre_requisites}', core_subjects = '${core_subjects}', anti_requisites = '${anti_requisites}', 
        co_requisites = '${co_requisites}', scredit_points = '${scredit_points}', subject_descriptions = '${subject_descriptions}', subject_level = '${subject_level}', electives = '${electives}',
        subject_fees = '${subject_fees}' WHERE course_id = '${course_id}';`;
        //const newRow = [subject_id, subject_name, pre_requisites, core_subjects, anti_requisites, co_requisites, scredit_points, subject_descriptions, subject_level, electives, subject_fees, course_id]
        return new Promise((resolve, reject) => {
            connection.query(sql, async (err, result) => {
                if (err) {
                    console.log('err', err)
                    return reject("fail to update");
                } else {
                    console.log(`Subject: ${subject_id} successfully updated!`);
                    return resolve({subject_id: subject_id, subject_name: subject_name});
                }
            });
        });
    } catch (error) {
        console.log(error);
    }
};
