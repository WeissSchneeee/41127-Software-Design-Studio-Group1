const express = require("express");
const { addErrorLog } = require("../../index.js");
const router = express.Router();
const connection = require("../../index.js").connection;

router.post("/", async (req, res) => {
    try {
        const { last_id, course_id, course_name, course_duration, course_credit_points, course_fees } = req.body;
        
        // update
        const updated = await update(last_id, course_id, course_name, course_duration, course_credit_points, course_fees);
        if (!updated.course_id) {
            return res.status(400).json({
                status: false,
                message: "Failed to update course!"
            });
        }
        return res.status(200).json({
            status: true,
            newid: updated.course_id,
            message: "Successfully update course!"
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

const update = async (last_id, course_id, course_name, course_duration, course_credit_points, course_fees) => {
    try {
        
        const sql = `update course set course_name = $2, course_duration = $3, course_credit_points = $4, course_fees = $5, course_id = $1 where course_id = $6;`
        const newRow = [course_id, course_name, course_duration, course_credit_points, course_fees, last_id]
        return new Promise((resolve, reject) => {
            connection.query(sql, newRow, async (err, result) => {
                if (err) {
                    console.log('err', err)
                    return reject(err);
                } else {
                    console.log(`Course: ${course_id} successfully updated!`);
                    return resolve({course_id: course_id, course_name: course_name});
                }
            });
        });
    } catch (error) {
        console.log(error);
        addErrorLog(req.originalUrl + "_update", error.toString())
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