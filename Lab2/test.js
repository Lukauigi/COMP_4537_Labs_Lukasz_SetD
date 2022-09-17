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

const { readFileSync, writeFileSync} = require('fs');


// console.log(x);

// console.log(path);

// console.log(path.resolve(__filename)); //absolute path
// console.log(path.basename(__filename)); //current filename
// console.log(path.dirname(__filename)); //path to module

// console.log(fs);

const x = readFileSync('./t1.txt', 'utf-8'); //file relative path & name, format
const y = readFileSync('./t2.txt', 'utf-8');

writeFileSync('./t3.txt', `${x}${y}`); //Creates & adds given content to file (Rewrites file if already present)