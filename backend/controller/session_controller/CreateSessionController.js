const express = require ("express");
const router = express.Router();
const connection = require("../../index.js").connection;

router.post("/", async (req, res) => {
    try{
        const {sessionType, sessionYear, censusDate} = req.body;
        const session = await createSession(sessionType, sessionYear, censusDate);
        if(!session){
            return res.status(400).json({
                status: false,
                message: "Failed to create new session!"
            });
        }
        return res.status(200).json({
            status: true,
            session: session,
            message: "Successfully created new session!"
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

const createSession = async (sessionType, sessionYear, censusDate) => {
    try{
        const sessionID = await generateID();
        const session = {
            session_id: String(sessionID).toUpperCase(),
            type: sessionType,
            year: sessionYear,
            census_date: new Date(censusDate).toLocaleDateString('en-AU', {day: "numeric", month: "short", year: "numeric"})
        };
        const sql = `INSERT INTO session VALUES ('${session.session_id}', '${session.type}', ${session.year}, '${session.census_date}');`;
        return new Promise((resolve, reject) => {
            connection.query(sql, async (err, result) => {
                if(err){
                    console.log(err);
                    return reject(null);
                }else{
                    console.log(`Session: ${session.session_id} successfully created!`);
                    return resolve(session);
                }
            });
        });
    }catch(error){
        console.log(error);
    }
};

const generateID = async _ => {
    const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
    const characters = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m"];
    // User ID format: SCCNNCCNNN
    let sessionID;
    do{
        sessionID = 'S' + characters[randomNumber(26)] + characters[randomNumber(26)] + numbers[randomNumber(10)] + numbers[randomNumber(10)] + characters[randomNumber(26)] + characters[randomNumber(26)] + numbers[randomNumber(10)] + numbers[randomNumber(10)] + numbers[randomNumber(10)];
        sessionID = String(sessionID).toUpperCase();
    }while(await isIDExists(sessionID));
    return sessionID;
};
const isIDExists = (data) => {
    const sql = `SELECT * FROM session WHERE session_id = '${String(data)}';`;
    
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if(err){
                console.log(err);
                return reject(true);
            }else{
                return resolve(result.rows.length > 0);
            }
        });
    });
};
const randomNumber = (n) => {
    return Math.floor(Math.random() * n);
};