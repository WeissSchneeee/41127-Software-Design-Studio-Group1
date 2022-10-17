const express = require ("express");
const router = express.Router();
const connection = require("../../index.js").connection;

router.post("/", async (req, res) => {
    try{
        const {list} = req.body;
        for(let i = 0; i < list.length; ++i){
            const sessionID = list[i];
            let session = await getSessionData(sessionID);
            session = session[0];
            const affectedSession = await deleteSession(sessionID);
            if(affectedSession != 1){
                console.log("Error founded during session deletion process!");
                return res.status(400).json({
                    status: false,
                    message: "Error founded during user deletion process!"
                });
            }
            console.log(`Session id: ${sessionID} successfully deleted!`);
        }
        return res.status(200).json({
            status: true,
            message: "Session successfully deleted!"
        });
    }catch(error){
        console.log(error);
        return res.status(400).json({
            status: false,
            message: error
        });
    }
});
module.exports = router;

const getSessionData = (sessionID) => {
    const sql = `SELECT * FROM session WHERE session_id = '${sessionID}';`;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if(err){
                console.log(err);
                return reject(null);
            }else{
                return resolve(result.rows);
            }
        });
    });
};
const deleteSession = (sessionID) => {
    const sql = `DELETE FROM session WHERE session_id = '${sessionID}';`;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if(err){
                console.log(err);
                return reject(null);
            }else{
                return resolve(result.rowCount);
            }
        });
    });
};