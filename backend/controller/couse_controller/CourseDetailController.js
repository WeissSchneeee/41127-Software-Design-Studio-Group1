const express = require("express");
const router = express.Router();
const {connection, addErrorLog} = require("../../index.js");

router.post("/", async (req, res) => {
    try {
        const sql = `SELECT * FROM course where course_id = $1`;
        connection.query(sql, [req.body.id], async (err, result) => {
            if (err) {
                console.log(err);   
                addErrorLog(req.originalUrl + "", error.toString())             
                return res.status(400).json({
                    status: false,
                    message: err.message
                });
            } else {
                if (result.rowCount > 0) {
                    return res.status(200).json({
                        status: true,
                        data: result.rows[0]
                    });
                } else {
                    return res.status(400).json({
                        status: false,
                        message: 'No data found!'
                    });
                }

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

const getAdminData = (userID) => {
    const sql = `SELECT * FROM system_admin WHERE admin_id = '${userID}';`;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return reject(true);
            } else {
                return resolve(result.rows[0]);
            }
        });
    });
};

const getStaffData = (userID) => {
    const sql = `SELECT * FROM staff WHERE staff_id = '${userID}';`;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return reject(true);
            } else {
                return resolve(result.rows[0]);
            }
        });
    });
};

const getStudentData = (userID) => {
    const sql = `SELECT * FROM student WHERE student_id = '${userID}';`;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return reject(true);
            } else {
                return resolve(result.rows[0]);
            }
        });
    });
};