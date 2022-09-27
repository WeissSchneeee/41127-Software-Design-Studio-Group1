const express = require("express");
const { addErrorLog } = require("../../index.js");
const router = express.Router();
const connection = require("../../index.js").connection;

router.post("/", async (req, res) => {
    try {
        const { list } = req.body;
        console.log(list);
        console.log(list[0]);
        // delete
        const sql = `delete from announcement_t where announcement_id = any($1)`
        await connection.query(sql, [list], async (err, result) => {
            if (err) {
                console.log('err', err)
                addErrorLog(req.originalUrl + "", err.toString())
                return res.status(400).json({
                    status: false,
                    message: "Failed to delete announcement!"
                });
            } else {
                console.log(`Annoucement: successfully deleted!`);
                return res.status(200).json({
                    status: true,
                    message: "Successfully delete announcement!"
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