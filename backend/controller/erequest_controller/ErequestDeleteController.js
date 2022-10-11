const express = require("express");
const router = express.Router();
const { connection, addErrorLog } = require("../../index.js");
const path = require("path");
const fs = require("fs");
const { resolve } = require("path");
const uploadFolder = path.join(path.dirname(path.dirname(__dirname)), "upload", "erequest");

router.post("/", async (req, res) => {
    try {

        const { list } = req.body;

        getDetail(list).then((rows) => {
            if (rows) {

                /* delete file first*/
                rows.map((detail) => {
                    if (detail.file) {
                        const filePath = path.join(uploadFolder, detail.file)
                        if (fs.existsSync(filePath)) {
                            fs.unlinkSync(filePath);
                        }
                    }
                    if (detail.answer_file) {
                        const filePath2 = path.join(uploadFolder, detail.answer_file)
                        if (fs.existsSync(filePath2)) {
                            fs.unlinkSync(filePath2);
                        }
                    }
                })

                /* delete from db */

                connection.query(
                    "delete from request where request_id = any($1)",
                    [list],
                    (error, result) => {
                        if (error) {
                            addErrorLog(req.originalUrl + "", error.toString())
                            return res.status(400).json({
                                status: false,
                                message: error.message
                            });
                        }
                        console.log(`REQUEST: successfully deleted!`);
                        return res.status(200).json({
                            status: true,
                            message: "Successfully delete REQUEST!"
                        });

                    }
                )



            }
        })

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


const getDetail = async (id) => {
    let sql = `
                select request_id, file, answer_file
                from request
                where request_id = any($1)
            `
    return new Promise((resolve, reject) => {
        connection.query(sql, [id], (err, result) => {
            if (err) {
                console.log(err);
                addErrorLog("request_delete_getdetail", error.toString())
                reject(false)
            } else {
                if (result.rowCount > 0) {
                    resolve(result.rows)
                } else {
                    reject(false)
                }

            }
        })
    });
}

