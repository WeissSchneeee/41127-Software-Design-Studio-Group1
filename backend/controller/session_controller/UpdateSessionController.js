const express = require ("express");
const router = express.Router();
const connection = require("../../index.js").connection;

router.post("/", async (req, res) => {
    try{
        const {sessionID, sessionType, sessionYear, censusDate} = req.body;
        let session = await getSession(sessionID);
        session = session[0];
        const affectedSession = await updateSessionData(sessionID, sessionType, sessionYear, censusDate);
        if(affectedSession != 1){
            console.log("Error founded during session data modification process!");
            return res.status(400).json({
                status: false,
                message: "Error founded during session data modification process!"
            });
        }
        session.type = sessionType;
        session.year = sessionYear;
        session.census_date = new Date(censusDate);
        const date = session.census_date;
        session.census_date = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
        return res.status(200).json({
            status: true,
            message: "Session successfully updated!",
            session: session
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

const getSession = (sessionID) => {
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

const updateSessionData = (sessionID, sessionType, sessionYear, censusDate) => {
    const sql = `UPDATE session set type = '${sessionType}', year = ${sessionYear}, census_date = '${censusDate}' WHERE session_id = '${sessionID}';`;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if(err){
                console.log(err);
                return reject(true);
            }else{
                return resolve(result.rowCount);
            }
        });
    });
};