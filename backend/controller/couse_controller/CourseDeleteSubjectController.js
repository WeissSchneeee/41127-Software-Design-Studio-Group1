const express = require("express");
const router = express.Router();
const connection = require("../../index.js").connection;

router.post("/", async (req, res) => {
    try {
        const { list, course_id } = req.body;

        // delete
        const sql = `delete from course_subject_list where list_course_id = $2 and list_subject_id = any($1)`
        await connection.query(sql, [list, course_id], async (err, result) => {
            if (err) {
                console.log('err', err)
                return res.status(400).json({
                    status: false,
                    message: "Failed to delete subject list!"
                });
            } else {
                console.log(`Subject list: successfully deleted!`);
                return res.status(200).json({
                    status: true,
                    message: "Successfully delete subject list!"
                });
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