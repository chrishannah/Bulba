#!/usr/bin/env node

const fs = require('fs')

function readProjectFile(filename) {
    return fs.readFileSync(__dirname + '/../' + filename, 'utf8');
}

function readProjectDir(filename) {
    return fs.readdirSync(__dirname + '/../' + filename, 'utf8');
}

module.exports = {
    readProjectFile,
    readProjectDir
}