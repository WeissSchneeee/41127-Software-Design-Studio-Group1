const express = require ("express");
const router = express.Router();
const connection = require("../../index.js").connection;
const { spawn } = require('child_process');
const { callback } = require("nodemailer/lib/shared/index.js");
const child = spawn('dir', [], {shell: true});

var KNNResult = '22';
console. log("Current directory:", __dirname);
// const childPython = spawn('py', ['--version']);

// const childPython = spawn('py', ['controller/KNN_controller/hello_knn.py']);

// childPython.stdout.on('data', (data) => {
//     console.log(`stdout: ${data}`);
// });

// childPython.stderr.on('data', (data) => {
//     console.log(`stderr: ${data}`);
// });

// childPython.on('close', (code) => {
//     console.log(`python script exited with code: ${code}`);
// });

router.post("/", async (req, res) => {
    try{
        const {coreSubject, subjectQuiz, subjectIndiAssign, subjectGroupAssign, subjectExam, subjectPreRS, major} = req.body;
        console.log(coreSubject, subjectQuiz, subjectIndiAssign, subjectGroupAssign, subjectExam, subjectPreRS, major);
        const result = await KNN(coreSubject, subjectQuiz, subjectIndiAssign, subjectGroupAssign, subjectExam, subjectPreRS, major);
        console.log(result);
        console.log('1');
        console.log(KNNResult);
        return res.status(200).json({
            status: true,
            //enrolment: list
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

function KNN(coreSubject, subjectQuiz, subjectIndiAssign, subjectGroupAssign, subjectExam, subjectPreRS, major){
    var d;
    var command = [`${coreSubject},${subjectQuiz},${subjectIndiAssign},${subjectGroupAssign},${subjectExam},${subjectPreRS},${major}`];
    command.unshift('controller/KNN_controller/hello_knn.py');
    const py = spawn('py', command);
    console.log(py.toString());
    py.stdout.on('data', (data) => {
        d = data.toString();
        KNNResult = d
        console.log(d);
        if(callback)
        return callback(d);
    });
    py.stderr.on('data', (data) => {
        KNNResult = data
        console.log(`stderr: ${data}`);
    });
    py.on('close', (code) => {
        console.log(`python script exited with code: ${code}`);
        if(callback)
        return callback(d);
    });
};