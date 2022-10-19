const express = require ("express");
const router = express.Router();
const connection = require("../../index.js").connection;

router.post("/", async (req, res) => {
    try{
        const sql = `SELECT * FROM session ORDER BY census_date DESC`;
        connection.query(sql, async (err, result) => {
            if(err){
                console.log(err);
                return res.status(400).json({
                    status: false,
                    message: err
                });
            }else{
                const list = [];
                const readData = async (list) => {
                    for(let i = 0; i < result.rows.length; ++i){
                        const data = result.rows[i];
                        let censusDate = new Date(data.census_date);
                        censusDate = new Date(censusDate.getTime() - (censusDate.getTimezoneOffset() * 6000)).toLocaleDateString('en-AU', {day: "numeric", month: "short", year: "numeric"});
                        const session = {
                            session_id: data.session_id,
                            type: data.type,
                            year: data.year,
                            census_date: censusDate
                        };
                        list.push(session);
                    }
                };
                await readData(list);
                return res.status(200).json({
                    status: true,
                    sessions: list
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