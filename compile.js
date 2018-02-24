const path = require('path');
const fs = require ('fs');
const solc = require('solc');




function compile(filename, contractName) {
    const inboxPath = path.resolve(__dirname, 'contracts', filename);
    const source = fs.readFileSync(inboxPath, 'utf8');
    return solc.compile(source, 1).contracts[':' + contractName];
}

module.exports = {
    compile: compile
}