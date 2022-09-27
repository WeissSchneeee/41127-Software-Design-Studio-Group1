const { Console } = require("console");
const express = require ("express");
const { addErrorLog } = require("../../index.js");
const router = express.Router();
const connection = require("../../index.js").connection;

router.post("/", async (req, res) => {
    try {
        const { announcement_id, announcement_title, announcement_description, announcement_date, admin_id } = req.body;

        // create new
        const inserted = await createNew(course_id, course_name, course_duration, course_credit_points, course_fees);
        if (!inserted.newID) {
            return res.status(400).json({
                status: false,
                message: "Failed to create new course!"
            });
        }
        return res.status(200).json({
            status: true,
            newid: inserted.newID,
            message: "Successfully created new course!"
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