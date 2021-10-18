#!/usr/bin/env node

const fs = require('fs')
const files = require("../tools/files.js");
const { readProjectFile } = require('../tools/files')

function initBlog() {
    // Create directories
    fs.mkdirSync('content/posts', { recursive: true });
    fs.mkdirSync('assets', { recursive: true });

    // Create initial config file
    var configFile = readProjectFile('resources/blank-config.yaml');
    fs.writeFileSync('config.yaml', configFile);
}

module.exports = {
    initBlog
}