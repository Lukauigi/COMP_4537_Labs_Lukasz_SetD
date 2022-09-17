// -------------------------------- \\
//|\\ -- User-defined Modules -- //|\\
// -------------------------------- \\
// const { age, name_ } = require('./data.js'); //import from module (file, dependency, etc)
// //use brackets to use mutliple things from module. also called destructuring

// printNameAndAge = () => {
//     console.log(name_, age);
// }
// printNameAndAge

// ---------------------------- \\
//|\\ -- Built-in Modules -- //|\\
// ---------------------------- \\

// const x = require('os');
// const path = require('path');

// const fs = require('fs');

// const { readFileSync, writeFileSync} = require('fs');


// console.log(x);

// console.log(path);

// console.log(path.resolve(__filename)); //absolute path
// console.log(path.basename(__filename)); //current filename
// console.log(path.dirname(__filename)); //path to module

// console.log(fs); //can log the module

// const x = readFileSync('./t1.txt', 'utf-8'); //file relative path & name, format
// const y = readFileSync('./t2.txt', 'utf-8');

// writeFileSync('./t3.txt', `${x}${y}`); //Creates & adds given content to file (Rewrites file if already present)

// -------------------------- \\
//|\\ -- Sync vs. Async -- //|\\
// -------------------------- \\

const { readFile, writeFile, write } = require('fs');

// var x = '';
// var y = '';

//callback hell
// readFile('./t1.txt', 'utf-8', (err, result) => {
//     if (err) { //error guard
//         console.log(err);
//         return;
//     }
//     x = result;

//     readFile('./t2.txt', 'utf-8', (err, result) => { //use callbacks as a form of dependency. Do this before that.
//         if (err) {
//             console.log(err)
//             return;
//         }
//         y= result;

//         writeFile('./t3.txt', `${x}${y}`, (err, result) => {
//             if (err) {
//                 console.log(err);
//                 return;
//             }
//         })
//     })
// })

// promise hell
const getText = (fName) => {
  return new Promise((resolve, reject) => { //a promise is an object. Either accepted or rejected.
    readFile(fName, 'utf-8', (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

// var x = ""
// var y = ""

// getText('./t1.txt')
// //then executes after being accepted
//   .then((result) => { 
//     x = result
//     getText('./t2.txt')
//       .then((result) => {
//         y = result
//         // console.log(result);
//         writeFile('./t3.txt', `${x}${y}`, (err) => {if (err) console.log("write" + err); })
//       })
//   })
//   //catch executes if promise is rejected
//   .catch((err) => { console.log("catch" + err); });

// getText('./t1.txt')
//   .then((result) => {
//     x = result
//     return getText('./t2.txt')
// })
// .then((result) => {
//     y = result
//         // console.log(result);
//         writeFile('./t3.txt', `${x}${y}`, (err) => {if (err) console.log("write" + err); })
//       })
//   .catch((err) => { console.log("catch" + err); });

// Using async function with await keyword 
// const start = async () => {
//     var x = "rubbish"
//     var y = "rubbish"
//     try {
//       x = await getText('./t1.txt');
//       console.log(x);
//       y = await getText('./t2.txt');
//       console.log(y);
//     }
//     catch (err) {
//       console.log(err);
//     }
//     writeFile('./t3.txt', `${x}${y}`, (err) => { if (err) console.log(err); })
//   }
  
//   start();

// promisify function from util library

const util = require('util');
const readFilePromise = util.promisify(readFile);
const writeFilePromise = util.promisify(writeFile);

var x = "rubbish";
var y = "more rubbish";

const start = async () => {
    try {
        x = await readFilePromise('./t1.txt', 'utf-8');
        y = await readFilePromise('./t2.txt', 'utf-8');
    } catch (err) {
        console.log(err);
    }
    await writeFilePromise('./t3.txt', `${x}${y}`, (err) => { if (err) console.log(err); })
}

start();

const http = require('http')

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.end('Welcome to our home page')
  } else if (req.url === '/about') {
    res.end('Here is our short history')
  } else {
    res.end(`
    <h1>Oops!</h1>
    <p>We can't seem to find the page you are looking for</p>
    <a href="/">back home</a>
    `)
  }
})

server.listen(5000);