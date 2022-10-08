const express = require("express");
const { addErrorLog } = require("../../index.js");
const router = express.Router();
const connection = require("../../index.js").connection;

router.post("/", async (req, res) => {
    try {
        const { announcement_id, announcement_title, announcement_description, announcement_date, admin_id } = req.body;
        
        // update
        const updated = await update(announcement_id, announcement_title, announcement_description, announcement_date, admin_id);
        if (!updated.announcement_id) {
            return res.status(400).json({
                status: false,
                message: "Failed to update course!"
            });
        }
        return res.status(200).json({
            status: true,
            newid: updated.announcement_id,
            message: "Successfully update course!"
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

const update = async (announcement_id, announcement_title, announcement_description, announcement_date, admin_id) => {
    try {
        
        const sql = `update announcement_t set announcement_title = $2, announcement_description = $3, announcement_date = $4, admin_id = $5, announcement_id = $1 where announcement_id = $6;`
        const newRow = [announcement_id, announcement_title, announcement_description, announcement_date, admin_id]
        return new Promise((resolve, reject) => {
            connection.query(sql, newRow, async (err, result) => {
                if (err) {
                    console.log('err', err)
                    return reject(err);
                } else {
                    console.log(`Announcement: ${announcement_id} successfully updated!`);
                    return resolve({announcement_id: announcement_id, announcement_title: announcement_title});
                }
            });
        });
    } catch (error) {
        console.log(error);
        addErrorLog(req.originalUrl + "_update", error.toString())
    }
};