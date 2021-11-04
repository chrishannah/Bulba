#!/usr/bin/env node

const fs = require('fs')
const fsExtra = require('fs-extra')

function readProjectFile(filename) {
    return fs.readFileSync(__dirname + '/../' + filename, 'utf8');
}

function readProjectDir(filename) {
    return fs.readdirSync(__dirname + '/../' + filename, 'utf8');
}

function rebuildOutputDir(config) {
    // Rebuild output directory
    const outDir = config.outputDirectory;
    fs.mkdirSync(outDir, { recursive: true });
    fsExtra.emptyDirSync(outDir)
    fs.mkdirSync(outDir + 'assets/css', { recursive: true });
    fs.mkdirSync(outDir + 'assets/js', { recursive: true });
    fs.mkdirSync(outDir + 'assets/images', { recursive: true });
}

module.exports = {
    readProjectFile,
    readProjectDir,
    rebuildOutputDir
}