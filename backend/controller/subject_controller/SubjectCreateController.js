const express = require("express");
const router = express.Router();
const connection = require("../../index.js").connection;

router.post("/", async (req, res) => {
    try {
        const { subject_id, subject_name, pre_requisites, core_subjects, anti_requisites, co_requisites, scredit_points, subject_descriptions, subject_level, electives, subject_fees, course_id } = req.body;

        // create new
        const inserted = await createNew(subject_id, subject_name, pre_requisites, core_subjects, anti_requisites, co_requisites, scredit_points, subject_descriptions, subject_level, electives, subject_fees, course_id);
        if (!inserted) {
            return res.status(400).json({
                status: false,
                message: "Failed to create new subject!"
            });
        }
        return res.status(200).json({
            status: true,
            subject_id: inserted.subject_id,
            message: "Successfully created new subject!"
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

const createNew = async (subject_id, subject_name, pre_requisites, core_subjects, anti_requisites, co_requisites, scredit_points, subject_descriptions, subject_level, electives, subject_fees, course_id) => {
    try {
        console.log("Start");
        // if (!course_id || !subject_id) {
        //     return
        // }
        console.log("Continue");
        console.log(`${course_id}`);
        const sql = `INSERT INTO subject VALUES('${subject_id}', '${subject_name}', '${pre_requisites}', '${core_subjects}', '${anti_requisites}', '${co_requisites}', '${scredit_points}', '${subject_descriptions}', '${subject_level}', '${electives}', '${subject_fees}', '${course_id}');`;
        //const newRow = [subject_id, subject_name, pre_requisites, core_subjects, anti_requisites, co_requisites, scredit_points, subject_descriptions, subject_level, electives, subject_fees, course_id]
        //eg `INSERT INTO student VALUES ('${userID}', '${dob}');`;
        return new Promise((resolve, reject) => {
            connection.query(sql, async (err, result) => {
                if (err) {
                    console.log('err', err)
                    return reject("fail to create");
                } else {
                    console.log(`${subject_id} and ${subject_descriptions}`);
                    console.log(`Subject: ${subject_id} successfully created!`);
                    return resolve({ subject_id: subject_id, subject_name: subject_name });
                }
            });
        });
    } catch (error) {
        console.log(error);
    }
};




// const isExisted = (field, data) => {
//     const sql = `SELECT * FROM subject WHERE ${field} = $1`;

//     return new Promise((resolve, reject) => {
//         connection.query(sql, [data], (err, result) => {
//             if (err) {
//                 console.log(err);
//                 return reject(true);
//             } else {
//                 return resolve(result.rows.length > 0);
//             }
//         });
//     });
// };