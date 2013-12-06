var uuid = require("node-uuid");

var guid = uuid.v1();

var token = guid.substring(8,4);

console.log(token);