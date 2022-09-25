const { Console } = require("console");
const express = require ("express");
const { addErrorLog } = require("../../index.js");
const router = express.Router();
const connection = require("../../index.js").connection;

router.post("/", async (req, res) => {
    try{
        const sql = `SELECT * FROM announcement_t`;
        connection.query(sql, async (err, result) => {
            if(err){
                console.log(err);
                return res.status(400).json({
                    status: false,
                    message: err
                });
            }else{
                const announcements = [];
                const readData = async (announcements) => {
                for(let i = 0; i < result.rows.length; ++i){
                    const data = result.rows[i];
                    console.log(data);
                    const announcement = {
                    announcement_id: data.announcement_id,
                    announcement_title: data.announcement_title,
                    //announcement_description: data.announcement_description,
                    announcement_date: data.announcement_date                   
                }
                announcements.push(announcement)

                    // user_id: userID,
                    // email_address: String(data.email_address).toLowerCase(),
                    // password: data.password,
                    // first_name: data.first_name,
                    // last_name: data.last_name,
                    // contact_number: data.contact_number,
                    // user_type: (String(data.user_type).toLowerCase() === 'a') ? "System Admin" : (String(data.user_type).toLowerCase() === 'e' ? "Staff" : "Student"),
                    // role: (String(data.user_type).toLowerCase() === 'a' || String(data.user_type).toLowerCase() === 'e') ? uniqueData.role : "Student",
                    // dob: dob
                };
                
            };
                await(readData(announcements));
                console.log(announcements);
                return res.status(200).json({
                    status: true,
                    announcements: announcements
                });
            }
        });
    }catch(error){
        addErrorLog(req.originalUrl + "", error.toString())
        return res.status(400).json({
            status: false,
            message: error.toString()
        });
    }
});
module.exports = router;