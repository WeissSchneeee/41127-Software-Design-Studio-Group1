const express = require("express");
const { addErrorLog } = require("../../index.js");
const router = express.Router();
const connection = require("../../index.js").connection;
const formidable = require('formidable')
const path = require("path");
const fs = require("fs");
const { resolve } = require("path");
const uploadFolder = path.join(path.dirname(path.dirname(__dirname)), "upload", "erequest");

router.post("/", async (req, res) => {
    try {

        if (!fs.existsSync(uploadFolder)) {
            fs.mkdirSync(uploadFolder, {recursive: true});
        }

        const form = new formidable.IncomingForm();
        form.uploadDir = uploadFolder;
        form.keepExtensions = true;
        form.parse(req, function (err, field, files) {
            if (err !== null) {
                console.log(err)
                return res.status(400).json({
                    status: false,
                    message: err.message
                });
            }
            let filename = null;

            if (files.answ_file) {
                const basename = files.answ_file.newFilename
                const extsn = files.answ_file.originalFilename.split(".").pop();
                filename = basename + "." + extsn;

                try {
                    fs.renameSync(path.join(uploadFolder, basename), path.join(uploadFolder, filename))
                } catch (err) { console.log("fs", err) }
            }

            const { request_id, student_id, answer, answer_by } = field

            // create new
            new Promise((resolve, reject) => {
                const result = update(request_id, answer, filename, answer_by);
                resolve(result)
            }).then((inserted) => {
                if (!inserted.request_id) {
                    return res.status(400).json({
                        status: false,
                        message: "Failed to update answer!"
                    });
                }
                return res.status(200).json({
                    status: true,
                    newid: inserted.request_id,
                    message: "Successfully update answer!",
                    files: files
                });
            })

        })

        return;


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

const update = async (last_id, answer, answer_file, answer_by) => {
    try {
        let sql = null
        let newRow = []
        if (answer_file) {
            sql = `update request set
            answer_time = now(), answer = $2, answer_file = $3, answer_by = $4, status = $5
            where request_id = $1;`
            newRow = [last_id, answer, answer_file, answer_by, 2]
        } else {
            sql = `update request set
            answer_time = now(), answer = $2, answer_by = $3, status = $4
            where request_id = $1;`
            newRow = [last_id, answer, answer_by, 2]
        }
        
        return new Promise((resolve, reject) => {
            connection.query(sql, newRow, async (err, result) => {
                if (err) {
                    console.log('err', err)
                    return reject(err);
                } else {
                    console.log(`Request: ${last_id} successfully updated!`);
                    return resolve({ request_id: last_id });
                }
            });
        });
    } catch (error) {
        console.log(error);
        addErrorLog("request_update_answer", error.toString())
    }
};


const isExisted = (field, data) => {
    const sql = `SELECT * FROM course WHERE ${field} = $1`;

    return new Promise((resolve, reject) => {
        connection.query(sql, [data], (err, result) => {
            if (err) {
                console.log(err);
                return reject(true);
            } else {
                return resolve(result.rows.length > 0);
            }
        });
    });
};