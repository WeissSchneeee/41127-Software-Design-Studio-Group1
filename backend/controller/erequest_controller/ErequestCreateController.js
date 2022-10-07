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

            if (files.file) {
                const basename = files.file.newFilename
                const extsn = files.file.originalFilename.split(".").pop();
                filename = basename + "." + extsn;

                try {
                    fs.renameSync(path.join(uploadFolder, basename), path.join(uploadFolder, filename))
                } catch (err) { console.log("fs", err) }
            }

            const { student_id, question } = field

            // create new
            new Promise((resolve, reject) => {
                const result = add(student_id, question, filename);
                resolve(result)
            }).then((inserted) => {
                if (!inserted.newID) {
                    return res.status(400).json({
                        status: false,
                        message: "Failed to create add new request!"
                    });
                }
                return res.status(200).json({
                    status: true,
                    newid: inserted.newID,
                    message: "Successfully add new request!",
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

const add = async (student_id, question, filename) => {
    try {

        const newID = await generateID();
        const sql = `insert into request (request_id, student_id, ins_time, question, file, status) values ($1, $2, NOW(), $3, $4, $5);`
        const newRow = [newID, student_id, question, filename, 1]
        return new Promise((resolve, reject) => {
            connection.query(sql, newRow, async (err, result) => {
                if (err) {
                    console.log('err', err)
                    return reject(err);
                } else {
                    console.log(`Request successfully added!`);
                    return resolve({ newID: newID });
                }
            });
        });


    } catch (error) {
        console.log(error);
        // addErrorLog(req.originalUrl + "_add", error.toString())
    }
};


const generateID = async () => {
    const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
    const characters = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m"];
    // User ID format: UCCNNCCNNN
    let userID;
    do {
        userID = "REQ" + characters[randomNumber(26)] + characters[randomNumber(26)] + numbers[randomNumber(10)] + numbers[randomNumber(10)] + characters[randomNumber(26)] + characters[randomNumber(26)] + numbers[randomNumber(10)] + numbers[randomNumber(10)] + numbers[randomNumber(10)];
        userID = String(userID).toUpperCase();
    } while (await isExisted("request_id", userID));
    return userID;
};
const isExisted = (field, data) => {
    const sql = `SELECT * FROM request WHERE ${field} = '${String(data)}';`;

    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return reject(true);
            } else {
                return resolve(result.rows.length > 0);
            }
        });
    });
};
const randomNumber = (n) => {
    return Math.floor(Math.random() * n);
};