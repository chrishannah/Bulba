#!/usr/bin/env node

const greymatter = require('gray-matter')
const fs = require('fs')
const handlebars = require('handlebars')
const marked = require('marked')
const beautify = require('js-beautify').html
const yaml = require('js-yaml')
const path = require('path');
const fsExtra = require('fs-extra')
const moment = require("moment");
const { readProjectFile } = require('../tools/files')

function generateBlog() {
    configureHandlebars()
    rebuildOutputDir();
    generatePosts();
    exportAssets();
}

function configureHandlebars() {
    // Partials
    handlebars.registerPartial('default', '{{default}}');

    // Helpers
    handlebars.registerHelper('dateFormat', function (date, options) {
        const formatToUse = (arguments[1] && arguments[1].hash && arguments[1].hash.format) || "DD/MM/YYYY"
        return moment(date).format(formatToUse);
    });
}

function rebuildOutputDir() {
    // Rebuild output directory
    const outDir = 'out/';
    fs.mkdirSync(outDir, { recursive: true });
    fsExtra.emptyDirSync(outDir)
    fs.mkdirSync(outDir + 'assets/css', { recursive: true });
}

function generatePosts() {
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
    });

    // Render the posts through the template engine and generate static html files
    console.log('Generating HTML files:');
    var defaultTemplateFilename = 'templates/default.hbs';
    var defaultTemplateFile = readProjectFile(defaultTemplateFilename);
    var postTemplateFilename = 'templates/post.hbs';
    var postTemplateFile = readProjectFile(postTemplateFilename);
    var configFilename = "config.yaml";
    var configFile = fs.readFileSync(configFilename, 'utf8');
    var config = yaml.load(configFile);
    posts.forEach(post => {
        var postTemplate = handlebars.compile(postTemplateFile);
        var defaultTemplate = handlebars.compile(defaultTemplateFile);
        var content = {
            post,
            config
        }
        var postContent = postTemplate(content);
        var title = post.title + ' | ' + config.site.name;
        var page = defaultTemplate({ content: postContent, title: title, config: config });
        var beautified = beautify(page);

        var filename = 'out/' + post.meta.slug + '.html';
        fs.writeFileSync(filename, beautified);
        console.log('- ' + post.meta.title + ' (' + filename + ')');
    });

    // Generate archive page
    var archiveTemplateFilename = 'templates/archive.hbs';
    var archiveTemplateFile = readProjectFile(archiveTemplateFilename);
    var archiveTemplate = handlebars.compile(archiveTemplateFile);
    var defaultTemplate = handlebars.compile(defaultTemplateFile);

    var content = posts.map(post => {
        var path = post.meta.slug + '.html';

        return {
            post,
            path
        }
    });

    var archiveContent = archiveTemplate({ posts: content });
    var title = 'Archive | ' + config.site.name;
    var page = defaultTemplate({ content: archiveContent, title: title, config: config });
    var beautified = beautify(page);

    var filename = 'out/archive.html';
    fs.writeFileSync(filename, beautified);
    console.log('- Archive (' + filename + ')');
}

function exportAssets() {
    // Export all assets to output directory
    console.log("Exporting asset files")
    const inAssetsDir = 'assets/';
    const outAssetsDir = 'out/assets/';
    const assetFilenames = fs.readdirSync(inAssetsDir);
    assetFilenames.forEach(filename => {
        var inFilename = inAssetsDir + filename;
        var file = fs.readFileSync(inFilename, 'utf8');

        if (path.extname(filename) == ".css") {
            var outFilename = outAssetsDir + 'css/' + filename;
            fs.writeFileSync(outFilename, file);
            console.log('- ' + inFilename + ' => ' + outFilename);
        }
    })
}


module.exports = {
    generateBlog
}