const express = require("express");
const router = express.Router();
const connection = require("../../index.js").connection;

router.post("/", async (req, res) => {
    try {
        const { course_name, course_duration, course_credit_points, course_fees } = req.body;
        
        // create new
        const inserted = await createNew(course_name, course_duration, course_credit_points, course_fees);
        if (!inserted) {
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
        return res.status(400).json({
            status: false,
            message: error
        });
    }
});
module.exports = router;

const createNew = async (course_name, course_duration, course_credit_points, course_fees) => {
    try {
        
        const newID = await generateID();
        console.log("newid", newID)
        const sql = `insert into course(course_id, course_name, course_duration, course_credit_points, course_fees) values ($1, $2, $3, $4, $5);`
        const newRow = [newID, course_name, course_duration, course_credit_points, course_fees]
        return new Promise((resolve, reject) => {
            connection.query(sql, newRow, async (err, result) => {
                if (err) {
                    console.log('err', err)
                    return reject("Please check the input format");
                } else {
                    console.log(`Course: ${newID} successfully created!`);
                    return resolve({newID: newID, course_name: course_name});
                }
            });
        });
    } catch (error) {
        console.log(error);
    }
};
const generateID = async () => {
    const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
    const characters = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m"];
    // User ID format: UNNNCCC
    let newID;
    do {
        newID = String("CRS") + numbers[randomNumber(10)] + numbers[randomNumber(10)] + numbers[randomNumber(10)] + characters[randomNumber(26)] + characters[randomNumber(26)]+ characters[randomNumber(26)];
        newID = String(newID).toUpperCase();
    } while (await isExisted("course_id", newID));
    return newID;
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
const randomNumber = (n) => {
    return Math.floor(Math.random() * n);
};