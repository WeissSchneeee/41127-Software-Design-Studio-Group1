const express = require("express");
const { addErrorLog } = require("../../index.js");
const router = express.Router();
const connection = require("../../index.js").connection;

router.post("/", async (req, res) => {
    try {
        const sql = `SELECT * FROM subject where subject_id = $1`;
        connection.query(sql, [req.body.id], async (err, result) => {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    status: false,
                    message: err
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
        addErrorLog(req.originalUrl + "", JSON.stringify(error))
        return res.status(400).json({
            status: false,
            message: error
        });
    }
});
module.exports = router;