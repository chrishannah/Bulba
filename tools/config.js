#!/usr/bin/env node

const fs = require('fs')
const yaml = require('js-yaml')

function readConfig() {
    var configFilename = 'config.yaml'
    var configFile = fs.readFileSync(configFilename, 'utf8')
    return yaml.load(configFile)
}

module.exports = {
    readConfig
}