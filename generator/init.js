#!/usr/bin/env node

const fs = require('fs')
const files = require("../tools/files.js");
const { readProjectFile } = require('../tools/files')

function initBlog() {
    // Create directories
    fs.mkdirSync('content/posts/', { recursive: true });
    fs.mkdirSync('assets', { recursive: true });

    // Create initial config file
    var configFile = readProjectFile('resources/blank-config.yaml');
    fs.writeFileSync('config.yaml', configFile);

    // Create initial config file
    var aboutFile = readProjectFile('resources/example-about.md');
    fs.writeFileSync('content/about.md', aboutFile);

    // Create example blog post
    var postFile = readProjectFile('resources/example-post.md');
    fs.writeFileSync('content/posts/hello-world.md', postFile);
}

module.exports = {
    initBlog
}