const express = require ("express");
const router = express.Router();
const connection = require("../../index.js").connection;

router.post("/", async (req, res) => {
    try{
        const {sessionID} = req.body;
        const sql = `SELECT * FROM session WHERE session_id = '${sessionID}';`;
        connection.query(sql, (err, result) => {
            if(err){
                console.log(err);
                return res.status(400).json({
                    status: false,
                    message: err
                });
            }else{
                const session = result.rows[0];
                const date = new Date(session.census_date);
                session.census_date = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
                return res.status(200).json({
                    status: true,
                    session: session
                });
            }
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