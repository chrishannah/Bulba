#!/usr/bin/env node

const greymatter = require('gray-matter')
const fs = require('fs')
const marked = require('marked')

function readPosts() {
    // Read posts from content directory
    const postDir = 'content/posts/';
    const filenames = fs.readdirSync(postDir);
    console.log(filenames.length + ' file(s) found in posts directory');
    console.log('Reading files:');
    const posts = filenames.map(filename => {
        var file = fs.readFileSync(postDir + filename, 'utf8');
        const { data: meta, content: markdown } = greymatter(file);
        var content = marked(markdown);
        console.log(' - ' + meta.title + ' (' + filename + ')');

        return {
            meta,
            content
        }
    }).sort((a, b) => {
        return new Date(b.meta.date) - new Date(a.meta.date)
    });
    return posts;
}

module.exports = {
    readPosts
}