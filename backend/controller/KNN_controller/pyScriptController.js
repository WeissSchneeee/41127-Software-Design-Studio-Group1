const express = require ("express");
const router = express.Router();
const connection = require("../../index.js").connection;
const { spawn } = require('child_process');
const { callback } = require("nodemailer/lib/shared/index.js");
const child = spawn('dir', [], {shell: true});

console. log("Current directory:", __dirname);
// const childPython = spawn('py', ['--version']);
var knnresult = 'N/A';

router.post("/", async (req, res) => {
        const {coreSubject, subjectQuiz, subjectIndiAssign, subjectGroupAssign, subjectExam, subjectPreRS, major} = req.body;
        console.log(coreSubject, subjectQuiz, subjectIndiAssign, subjectGroupAssign, subjectExam, subjectPreRS, major);
        var command = [`${coreSubject}`,`${subjectQuiz}`,`${subjectIndiAssign}`,`${subjectGroupAssign}`,`${subjectExam}`,`${subjectPreRS}`,`${major}`];
        command.unshift('controller/KNN_controller/hello_knn.py');
        const py = spawn('py', command);
        py.stdout.on('data', (data) => {
            knnresult = data.toString().trim();
            console.log(knnresult);
            try{
            return res.status(200).json({
                status: true,
                message: "The most suitable subject based on your selection is: " + knnresult
            });
            }catch(error){
        console.log(error);
        return res.status(400).json({
            status: false,
            message: error
        });
    }
        });
        py.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
        });
        py.on('close', (code) => {
            console.log(`python script exited with code: ${code}`);
        });
});
module.exports = router;
