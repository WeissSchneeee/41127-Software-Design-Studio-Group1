const express = require("express");
const { addErrorLog } = require("../../index.js");
const router = express.Router();
const connection = require("../../index.js").connection;

router.post("/", async (req, res) => {
    try {
        const { list } = req.body;

        // delete
        const sql = `delete from course where course_id = any($1)`
        await connection.query(sql, [list], async (err, result) => {
            if (err) {
                console.log('err', err)
                return res.status(400).json({
                    status: false,
                    message: "Failed to delete course!"
                });
            } else {
                console.log(`Course: successfully deleted!`);
                return res.status(200).json({
                    status: true,
                    message: "Successfully delete course!"
                });
            }
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

const update = async (course_id, course_name, course_duration, course_credit_points, course_fees) => {
    try {


        const sql = `update course set course_name = $2, course_duration = $3, course_credit_points = $4, course_fees = $5 where course_id = $1;`
        const newRow = [course_id, course_name, course_duration, course_credit_points, course_fees]
        return new Promise((resolve, reject) => {
            connection.query(sql, newRow, async (err, result) => {
                if (err) {
                    console.log('err', err)
                    return reject(null);
                } else {
                    console.log(`Course: ${course_id} successfully created!`);
                    return resolve({ course_id: course_id, course_name: course_name });
                }
            });
        });
    } catch (error) {
        console.log(error);
    }
};