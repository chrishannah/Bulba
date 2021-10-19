#!/usr/bin/env node

const fs = require('fs')
const handlebars = require('handlebars')
const beautify = require('js-beautify').html
const yaml = require('js-yaml')
const path = require('path');
const moment = require("moment");
const marked = require('marked')
const { readProjectFile } = require('../tools/files')
const { readProjectDir } = require('../tools/files')
const { rebuildOutputDir } = require('../tools/files')
const { readPosts } = require('../generator/post')
const { buildFeed } = require('../generator/feed')

function generateBlog() {
    configureHandlebars()
    rebuildOutputDir();
    generateContent();
    exportAssets();
}

function configureHandlebars() {
    // Partials
    var headerFile = readProjectFile('templates/header.hbs');
    handlebars.registerPartial('header', headerFile);
    var paginationFile = readProjectFile('templates/pagination.hbs');
    handlebars.registerPartial('pagination', paginationFile);
    var footerFile = readProjectFile('templates/footer.hbs');
    handlebars.registerPartial('footer', footerFile);

    // Helpers
    handlebars.registerHelper('dateFormat', function (date, options) {
        const formatToUse = (arguments[1] && arguments[1].hash && arguments[1].hash.format) || "DD/MM/YYYY"
        return moment(date).format(formatToUse);
    });
}

function generateContent() {
    var posts = readPosts();

    var configFilename = "config.yaml";
    var configFile = fs.readFileSync(configFilename, 'utf8');
    var config = yaml.load(configFile);

    console.log('Generating HTML files:');
    generatePosts(posts, config);
    generateArchive(posts, config);
    generateIndex(posts, config);
    generateFeed(posts, config);
    generateAboutPage(config);
}

function generatePosts(posts, config) {
    // Render the posts through the template engine and generate static html files
    var defaultTemplateFilename = 'templates/default.hbs';
    var defaultTemplateFile = readProjectFile(defaultTemplateFilename);
    var postTemplateFilename = 'templates/post.hbs';
    var postTemplateFile = readProjectFile(postTemplateFilename);
    posts.forEach(post => {
        var postTemplate = handlebars.compile(postTemplateFile);
        var defaultTemplate = handlebars.compile(defaultTemplateFile);
        var content = {
            post,
            config
        }
        var postContent = postTemplate(content);
        var title = post.meta.title + ' | ' + config.site.name;
        var page = defaultTemplate({ content: postContent, title: title, config: config });
        var beautified = beautify(page);

        var filename = 'out/' + post.meta.slug + '.html';
        fs.writeFileSync(filename, beautified);
        console.log(' - ' + post.meta.title + ' (' + filename + ')');
    });
}

function generateArchive(posts, config) {
    // Generate archive page
    var archiveTemplateFilename = 'templates/archive.hbs';
    var archiveTemplateFile = readProjectFile(archiveTemplateFilename);
    var archiveTemplate = handlebars.compile(archiveTemplateFile);
    var defaultTemplateFilename = 'templates/default.hbs';
    var defaultTemplateFile = readProjectFile(defaultTemplateFilename);
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
    console.log(' - Archive (' + filename + ')');
}

function generateIndex(posts, config) {
    var postsPerPage = config.postsPerPage;
    var allPagedPosts = [];
    var currentPagePosts = []
    var i = 0;
    posts.forEach(post => {
        i++;
        currentPagePosts.push(post);

        if (i == postsPerPage) {
            i = 0;
            allPagedPosts.push(currentPagePosts);
            currentPagePosts = [];
        }
    })
    if (currentPagePosts.length > 0) {
        allPagedPosts.push(currentPagePosts);
    }

    var currentPage = 0;
    var allPages = [];
    allPagedPosts.forEach(pagedPosts => {
        currentPage++;

        var previousPage;
        var nextPage;

        if (currentPage == 2) {
            previousPage = 'index.html'
        } else if (currentPage > 1) {
            var prev = currentPage - 1;
            previousPage = 'page' + prev + '.html';
        }

        if (currentPage < allPagedPosts.length) {
            var next = currentPage + 1;
            nextPage = 'page' + next + '.html';
        }

        var path = 'page' + currentPage + '.html';
        if (currentPage == 1) {
            path = 'index.html';
        }

        var title = config.site.name + ' - Page ' + currentPage;
        if (currentPage == 1) {
            title = config.site.name;
        }

        if (pagedPosts.length > 0) {
            var page = {
                pagedPosts,
                path,
                previousPage,
                nextPage,
                title
            }

            allPages.push(page);
        }
    })

    var indexTemplateFilename = 'templates/index.hbs';
    var indexTemplateFile = readProjectFile(indexTemplateFilename);
    var indexTemplate = handlebars.compile(indexTemplateFile);
    var defaultTemplateFilename = 'templates/default.hbs';
    var defaultTemplateFile = readProjectFile(defaultTemplateFilename);
    var defaultTemplate = handlebars.compile(defaultTemplateFile);

    allPages.forEach(page => {
        var pageFilename = page.path;
        var indexContent = indexTemplate({ page: page });
        var indexPage = defaultTemplate({ content: indexContent, title: page.title, config: config });
        var beautified = beautify(indexPage);

        var filename = 'out/' + pageFilename;
        fs.writeFileSync(filename, beautified);
        console.log(' - Index (' + filename + ')');
    })
}

function generateFeed(posts, config) {
    buildFeed(posts, config);
}

function generateAboutPage(config) {
    // Generate about page
    var aboutTemplateFilename = 'templates/about.hbs';
    var aboutTemplateFile = readProjectFile(aboutTemplateFilename);
    var aboutTemplate = handlebars.compile(aboutTemplateFile);
    var defaultTemplateFilename = 'templates/default.hbs';
    var defaultTemplateFile = readProjectFile(defaultTemplateFilename);
    var defaultTemplate = handlebars.compile(defaultTemplateFile);

    var file = fs.readFileSync('content/about.md', 'utf8');
    var content = marked(file);

    var aboutContent = aboutTemplate({ content: content });
    var title = 'About | ' + config.site.name;
    var page = defaultTemplate({ content: aboutContent, title: title, config: config });
    var beautified = beautify(page);

    var filename = 'out/about.html';
    fs.writeFileSync(filename, beautified);
    console.log(' - About (' + filename + ')');
}

function exportAssets() {
    // Export all assets to output directory
    console.log("Exporting asset files:")
    const inAssetsDir = 'assets/';
    const outAssetsDir = 'out/assets/';
    const assetFilenames = readProjectDir(inAssetsDir);
    assetFilenames.forEach(filename => {
        var inFilename = inAssetsDir + filename;
        var file = readProjectFile(inFilename);

        if (path.extname(filename) == ".css") {
            var outFilename = outAssetsDir + 'css/' + filename;
            fs.writeFileSync(outFilename, file);
            console.log(' - ' + inFilename + ' => ' + outFilename);
        }
    })
}


module.exports = {
    generateBlog
}