#!/usr/bin/env node

const greymatter = require('gray-matter')
const fs = require('fs')
const handlebars = require('handlebars')
const marked = require('marked')
const beautify = require('js-beautify').html
const yaml = require('js-yaml')
const path = require('path');
const fsExtra = require('fs-extra')

// Rebuild output directory
const outDir = 'out/';
fsExtra.emptyDirSync(outDir)
fs.mkdirSync(outDir + 'assets/css', { recursive: true });

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

// Render the posts through the template engine and generate static html files
var postTemplateFilename = 'templates/post.hbs';
var postTemplateFile = fs.readFileSync(postTemplateFilename, 'utf8');
var configFilename = "config.yaml";
var configFile = fs.readFileSync(configFilename, 'utf8');
var config = yaml.load(configFile);
posts.forEach(post => {
    var postTemplate = handlebars.compile(postTemplateFile);
    var content = {
        post,
        config
    }
    var postPage = beautify(postTemplate(content), beautify);
    fs.writeFileSync('out/' + post.meta.slug + '.html', postPage);
});

// Export all assets to output directory
const inAssetsDir = 'assets/';
const outAssetsDir = 'out/assets/';
const assetFilenames = fs.readdirSync(inAssetsDir);
assetFilenames.forEach(filename => {
    var file = fs.readFileSync(inAssetsDir + filename, 'utf8');

    if (path.extname(filename) == ".css") {
        fs.writeFileSync(outAssetsDir + 'css/' + filename, file);
    }
})
