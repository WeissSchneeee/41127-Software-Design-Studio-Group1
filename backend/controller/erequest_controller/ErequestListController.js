const express = require("express");
const { addErrorLog } = require("../../index.js");
const router = express.Router();
const connection = require("../../index.js").connection;

router.post("/", async (req, res) => {
    try {

        const { userID } = req.body;
        const user = await getUserData(userID);
        if ((user) && (user.user_type)) {
            let arrWhere = []
            let sql = `
                select 
                    request.*, 
                    user_t.first_name, user_t.last_name, user_t.email_address,
                    answ.first_name as answer_by_fname, answ.last_name as answer_by_lname
                from request
                inner join student on request.student_id = student.student_id
                inner join user_t on user_t.user_id = student.student_id
                left join user_t as answ on answ.user_id = request.answer_by
            `
            if (user.user_type == 's') {
                sql += ` 
                    where user_t.user_id = $1
                `;
                arrWhere.push(user.user_id)
            }

            sql += ` 
                order by request.ins_time desc
            `
            connection.query(sql, arrWhere, async (err, result) => {
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
                        request: result.rows
                    });
                }
            });

        } else {
            return res.status(400).json({
                status: false,
                message: 'undefined user'
            });
        }



    } catch (error) {
        addErrorLog(req.originalUrl + "", error.toString())
        return res.status(400).json({
            status: false,
            message: error.message
        });
    }
});
module.exports = router;
const getUserData = (userID) => {
    const sql = `SELECT * FROM user_t WHERE user_id = '${userID}' limit 1;`;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return reject(null);
            } else {
                return resolve(result.rows[0]);
            }
        });
    });
};