const express = require("express");
const { addErrorLog } = require("../../index.js");
const router = express.Router();
const connection = require("../../index.js").connection;

router.post("/", async (req, res) => {
    try {
        const { course_id, subject_id } = req.body;

        // create new
        const inserted = await add(course_id, subject_id);
        if (!inserted.subject_id) {
            return res.status(400).json({
                status: false,
                message: "Failed to create add new subject!"
            });
        }
        return res.status(200).json({
            status: true,
            newid: inserted.subject_id,
            message: "Successfully add new subject!"
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

const add = async (course_id, subject_id) => {
    try {

        // const newID = await generateID();
        const newID = course_id;

        const isExisteds = await isExisted(course_id, subject_id);
        if (isExisteds) {
            console.log('err', `Subject has been exists`)
            return `Subjct has been exists`
        } else {
            const sql = `insert into course_subject_list(list_course_id, list_subject_id) values ($1, $2);`
            const newRow = [course_id, subject_id]
            return new Promise((resolve, reject) => {
                connection.query(sql, newRow, async (err, result) => {
                    if (err) {
                        console.log('err', err)
                        return reject(err);
                    } else {
                        console.log(`Subject successfully added!`);
                        return resolve({ course_id: course_id, subject_id: subject_id });
                    }
                });
            });
        }


    } catch (error) {
        console.log(error);
        addErrorLog(req.originalUrl + "_add", error.toString())    
    }
};

const isExisted = (course, subject) => {
    const sql = `SELECT * FROM course_subject_list WHERE list_course_id = $1 and list_subject_id = $2`;

    return new Promise((resolve, reject) => {
        connection.query(sql, [course, subject], (err, result) => {
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