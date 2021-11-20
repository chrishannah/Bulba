#!/usr/bin/env node

const yargs = require('yargs')
const { initBlog } = require('../generator/init')
const { generateBlog } = require('../generator/generator')

yargs
    .command('init', 'Initialises the directory structure for a Bulba blog', () => {}, () => {
        initBlog()
    })
    .command('generate', 'Generates the Bulba blog from the current directory', () => {}, () => {
        generateBlog()
    })
    .argv