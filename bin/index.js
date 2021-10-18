#!/usr/bin/env node

const greymatter = require('gray-matter')
const fs = require('fs')
const handlebars = require('handlebars')
const marked = require('marked')
const beautify = require('js-beautify').html
const yaml = require('js-yaml')
const path = require('path');
const fsExtra = require('fs-extra')
const yargs = require("yargs");
const { initBlog } = require('../generator/init')
const { generateBlog } = require('../generator/generator')

const options = yargs
    .command('init', 'Initialises the directory structure for a Bulba blog', () => { }, (argv) => {
        initBlog();
    })
    .command('generate', 'Generates the Bulba blog from the current directory', () => { }, (argv) => {
        generateBlog();
    })
    .argv;