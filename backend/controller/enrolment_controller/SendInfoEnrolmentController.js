const express = require("express");
const router = express.Router();
const connection = require("../../index.js").connection;
const { emailTransporter } = require("../../email")

router.post("/", async (req, res) => {
    try {
        const { enrolId } = req.body;

        const date = new Date();
        const year = date.getFullYear();
        const sql = `
            select * from enrolment
            inner join session on session.session_id = enrolment.session_id
            inner join student on student.student_id = enrolment.student_id
            inner join user_t on user_t.user_id = student.student_id
            inner join subject on subject.subject_id = enrolment.subject_id
            where enrolment_id = $1
        `;
        connection.query(sql, [enrolId], async (err, result) => {
            if (err) {
                console.log(err);
                addErrorLog(req.originalUrl + "", error.toString())
                return res.status(400).json({
                    status: false,
                    message: err.message
                });
            } else {
                if (result.rowCount > 0) {

                    const row = result.rows[0]

                    emailTransporter.sendMail({
                        from: '"CRS UTS" <youremail@gmail.com>', // sender address
                        to: row.email_address, // list of receivers
                        subject: "enrolment UTS Detail ✔", // Subject line
                        text: `Hi ${row.first_name}, this detail of your enrolment at UTS`, // plain text body
                        html: `
                        <p>Hi <b>${row.first_name}</b>, this detail of your enrolment at UTS</p>
                        <table>
                        <tr>
                            <td colspan="2"><b>enrolment Detail</b></td>
                        </tr>
                        <tr>
                            <td>enrolment Id</td>
                            <td>${row.enrolment_id}</td>
                        </tr>
                        <tr>
                            <td>Date</td>
                            <td>${row.enrolment_date}</td>
                        </tr>
                        <tr>
                            <td>Status</td>
                            <td>${row.status}</td>
                        </tr>
                        <tr>
                            <td colspan="2"><b>Session Detail</b></td>
                        </tr>
                        <tr>
                            <td>Session</td>
                            <td>${row.type}</td>
                        </tr>
                        <tr>
                            <td>Year</td>
                            <td>${row.year}</td>
                        </tr>
                        <tr>
                            <td>Census Date</td>
                            <td>${row.census_date}</td>
                        </tr>
                        <tr>
                            <td colspan="2"><b>Subject Detail</b></td>
                        </tr>
                        <tr>
                            <td>Subject Id</td>
                            <td>${row.subject_id}</td>
                        </tr>
                        <tr>
                            <td>Subject Name</td>
                            <td>${row.subject_name}</td>
                        </tr>
                        <tr>
                            <td>Subject Level</td>
                            <td>${row.subject_level}</td>
                        </tr>
                        </table>
                        `, // html body
                    }).then(info => {
                        console.log({ info });
                    }).catch(console.error);


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
        return res.status(400).json({
            status: false,
            message: error
        });
    }
});
module.exports = router;