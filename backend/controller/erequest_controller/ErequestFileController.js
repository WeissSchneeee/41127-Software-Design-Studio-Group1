const express = require("express");
const router = express.Router();
const { connection, addErrorLog } = require("../../index.js");
const path = require("path");
const fs = require("fs");
const { resolve } = require("path");
const uploadFolder = path.join(path.dirname(path.dirname(__dirname)), "upload", "erequest");

router.get("/", async (req, res) => {
    try {
        const { id, get } = req.query
        let sql = `
                select file, answer_file
                from request
                where request_id = $1
            `

        connection.query(sql, [id], (err, result) => {
            
            if (err) {
                console.log(err);
                addErrorLog(req.originalUrl + "", error.toString())
                return res.status(400).json({
                    status: false,
                    message: err.message
                });
            } else {
                if (result.rowCount > 0) {
                    const detail = result.rows[0]
                    let filePath = null
                    let filename = null
                    if (get === 'request') {
                        filename = detail.file
                    } else {
                        filename = detail.answer_file
                    }
                    filePath = path.join(uploadFolder, filename)
                    if (fs.existsSync(filePath)) {
                        file = fs.readFileSync(filePath);
                        res.writeHead(200, { "Content-Type": "text/plain", "content-disposition": `attachment; filename=${filename}` });
                        res.write(file);
                        res.end();
                        return ;
                    }
                    

                }
                return res.status(400).json({
                    status: false,
                    message: 'No data found!'
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
