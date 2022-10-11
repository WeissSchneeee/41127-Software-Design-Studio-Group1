const express = require("express");
const router = express.Router();
const { connection, addErrorLog } = require("../../index.js");

router.post("/", async (req, res) => {
    try {
        let sql = `
                select 
                    request.*, 
                    user_t.first_name, user_t.last_name, user_t.email_address,
                    answ.first_name as answer_by_fname, answ.last_name as answer_by_lname
                from request
                inner join student on request.student_id = student.student_id
                inner join user_t on user_t.user_id = student.student_id
                left join user_t as answ on answ.user_id = request.answer_by
                where request_id = $1
            `

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
