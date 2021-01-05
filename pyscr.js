'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const spawn = require('child_process').spawn;

const runPy = (dir, callback) => {
  const ls = spawn('python', ['diff.py', 'pf', dir]);

  ls.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  ls.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    callback(null)
  });
}
exports.runPy = runPy;

const openPy = (dir, callback) => {
  const ls = spawn('python', ['diff.py', 'of', dir]);
  let obj;
  ls.stdout.on('data', (data) => {
    obj = data;
  });

  ls.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    callback(obj.toString());
  });
}
exports.openPy = openPy;

const zipPy = (dir, name, callback) => {
  const ls = spawn('python', ['zipper.py', dir, dir+'/'+name]);
  
  ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    callback(null);
  });
}
exports.zipPy = zipPy;

const plagPy = (dir, callback) => {
  const ls = spawn('python', ['check.py', dir]);
  
  ls.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  ls.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });
 
  ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    callback(null);
  });
}
exports.plagPy = plagPy;