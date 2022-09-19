const { spawn } = require('child_process');
const child = spawn('dir', [], {shell: true});


//const childPython = spawn('py', ['--version']);

const childPython = spawn('py', ['../KNN/hello_knn.py']);

childPython.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

childPython.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
});

childPython.on('close', (code) => {
    console.log(`python script exited with code: ${code}`);
});