const express = require("express");
const { addErrorLog } = require("../../index.js");
const router = express.Router();
const connection = require("../../index.js").connection;

router.post("/", async (req, res) => {
    try {
        const sql = `SELECT * FROM sys_log order by id desc`;
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
                    sys_log: result.rows
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
