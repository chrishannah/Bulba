#!/usr/bin/env node

const greymatter = require('gray-matter')
const fs = require('fs')
const handlebars = require('handlebars')
const marked = require('marked')

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
})

var postTemplateFilename = 'templates/post.hbs';
var postTemplateFile = fs.readFileSync(postTemplateFilename, 'utf8');
posts.forEach(post => {
    var postTemplate = handlebars.compile(postTemplateFile);
    var postPage = postTemplate(post);
    fs.writeFileSync('out/' + post.meta.slug + '.html', postPage);
});


