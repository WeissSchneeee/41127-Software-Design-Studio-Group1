const { Console } = require("console");
const express = require ("express");
const { addErrorLog } = require("../../index.js");
const router = express.Router();
const connection = require("../../index.js").connection;

router.post("/", async (req, res) => {
    try {
        const { announcement_id, announcement_title, announcement_description, announcement_date, admin_id } = req.body;

        // create new
        const inserted = await createNew(announcement_id, announcement_title, announcement_description, announcement_date, admin_id);
        if (!inserted.newID) {
            return res.status(400).json({
                status: false,
                message: "Failed to create new announcement!"
            });
        }
        return res.status(200).json({
            status: true,
            newid: inserted.newID,
            message: "Successfully created new announcement!"
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

const createNew = async (announcement_id, announcement_title, announcement_description, announcement_date, admin_id) => {
    try {

        const newID = await generateID();
        //const newID = announcement_id;

        const isExisteds = await isExisted("announcement_id", newID);
        if (isExisteds) {
            console.log('err', `announcement_id ${newID} has been exists`)
            return `announcement_id ${newID} has been exists`
        } else {
            const sql = `insert into announcement_t(announcement_id, announcement_title, announcement_description, announcement_date, admin_id) values ($1, $2, $3, $4, $5);`
            const newRow = [newID, announcement_title, announcement_description, announcement_date, admin_id]
            return new Promise((resolve, reject) => {
                connection.query(sql, newRow, async (err, result) => {
                    if (err) {
                        console.log('err', err)
                        return reject(err);
                    } else {
                        console.log(`announcement: ${newID} successfully created!`);
                        return resolve({ newID: newID, announcement_title: announcement_title });
                    }
                });
            });
        }


    } catch (error) {
        console.log(error);
        addErrorLog(req.originalUrl + "", error.toString())    
    }
};
const generateID = async () => {
    const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
    const characters = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m"];
    // User ID format: UNNNCCC
    let newID;
    do {
        newID = String("ANC") + numbers[randomNumber(10)] + numbers[randomNumber(10)] + numbers[randomNumber(10)] + characters[randomNumber(26)] + characters[randomNumber(26)] + characters[randomNumber(26)];
        newID = String(newID).toUpperCase();
    } while (await isExisted("announcement_id", newID));
    return newID;
};
const isExisted = (field, data) => {
    const sql = `SELECT * FROM announcement_t WHERE ${field} = $1`;

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