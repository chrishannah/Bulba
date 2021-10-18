#!/usr/bin/env node

const gm = require('gray-matter')
const fs = require('fs')

const postDir = 'content/posts/';
const filenames = fs.readdirSync(postDir);
console.log(filenames.length + ' file(s) found in posts directory');

console.log('Reading files:');
const posts = filenames.map(filename => {
    var file = fs.readFileSync(postDir + filename, 'utf8');
    const {data:meta, content} = gm(file);
    console.log(' - ' + meta.title + ' (' + filename + ')');

    return {
        meta,
        content
    }
});



