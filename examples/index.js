const Boot = require('pencl-base');

Boot(__dirname);

const database = require('pencl-database');

console.log(database.config);
console.log(database.debug);