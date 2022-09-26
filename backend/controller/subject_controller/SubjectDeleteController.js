const express = require("express");
const { addErrorLog } = require("../../index.js");
const router = express.Router();
const connection = require("../../index.js").connection;

router.post("/", async (req, res) => {
    try {
        const { list } = req.body;

        // delete
        const sql = `delete from subject where subject_id = any($1)`
        await connection.query(sql, [list], async (err, result) => {
            if (err) {
                console.log('err', err)
                addErrorLog(req.originalUrl + "", err.toString())
                return res.status(400).json({
                    status: false,
                    message: "Failed to delete subject!"
                });
            } else {
                console.log(`Subject: successfully deleted!`);
                return res.status(200).json({
                    status: true,
                    message: "Successfully delete subject!"
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