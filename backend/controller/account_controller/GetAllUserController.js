const express = require ("express");
const router = express.Router();
const connection = require("../../index.js").connection;

router.post("/", async (req, res) => {
    try{
        const {userID} = req.body;
        const sql = `SELECT * FROM user_t WHERE user_id != '${userID}';`;
        connection.query(sql, async (err, result) => {
            if(err){
                console.log(err);
                return res.status(400).json({
                    status: false,
                    message: err
                });
            }else{
                const users = [];
                const readData = async (users) => {
                    for(let i = 0; i < result.rows.length; ++i){
                        const data = result.rows[i];
                        const user = {
                            user_id: String(data.user_id).toUpperCase(),
                            email_address: String(data.email_address).toLowerCase(),
                            password: data.password,
                            first_name: data.first_name,
                            last_name: data.last_name,
                            contact_number: data.contact_number,
                            user_type: (String(data.user_type).toLowerCase() === 'a') ? "System Admin" : (String(data.user_type).toLowerCase() === 'e' ? "Staff" : "Student")
                        };
                        users.push(user);
                    }
                };
                await readData(users);
                return res.status(200).json({
                    status: true,
                    users: users
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