#!/usr/bin/env node

const yargs = require("yargs");
const { initBlog } = require('../generator/init')
const { generateBlog } = require('../generator/generator')

const options = yargs
    .command('init', 'Initialises the directory structure for a Bulba blog', () => {}, (argv) => {
        initBlog();
    })
    .command('generate', 'Generates the Bulba blog from the current directory', () => {}, (argv) => {
        generateBlog();
    })
    .argv;