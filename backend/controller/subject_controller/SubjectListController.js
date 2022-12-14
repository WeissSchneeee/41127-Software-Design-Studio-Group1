const express = require("express");
const { addErrorLog } = require("../../index.js");
const router = express.Router();
const connection = require("../../index.js").connection;

router.post("/", async (req, res) => {
    try {
        const sql = `SELECT * FROM subject order by subject_id asc`;
        connection.query(sql, async (err, result) => {
            if (err) {
                console.log(err);
                addErrorLog(req.originalUrl + "", err.toString())
                return res.status(400).json({
                    status: false,
                    message: err.message
                });
            } else {
                return res.status(200).json({
                    status: true,
                    subject: result.rows
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

router.post("/fromcourse", async (req, res) => {
    try {
        const sql = `SELECT * 
            FROM course_subject_list 
            inner join course on course.course_id = course_subject_list.list_course_id
            inner join subject on subject.subject_id = course_subject_list.list_subject_id  
            where list_course_id = $1 order by subject_id asc`;
        const { course_id } = req.body
        connection.query(sql, [course_id], async (err, result) => {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    status: false,
                    message: err.message
                });
            } else {
                return res.status(200).json({
                    status: true,
                    subject: result.rows
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
