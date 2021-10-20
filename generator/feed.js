#!/usr/bin/env node

const Feed = require('feed').Feed;
const fs = require('fs')

function buildFeed(posts, config) {
    var feed = createSiteFeed(config);

    posts.forEach(post => {
        var postUrl = config.site.url + post.meta.slug + '.html';
        feed.addItem({
            title: post.meta.title,
            id: postUrl,
            link: postUrl,
            description: post.meta.excerpt,
            content: post.content,
            author: [
                {
                    name: config.author.name,
                    link: config.author.link
                }
            ],
            date: post.meta.date
        });
    });

    const outDir = config.outputDirectory;
    var filename = outDir + 'feed.json';
    fs.writeFileSync(filename, feed.json1());
}

function createSiteFeed(config) {
    return new Feed({
        title: config.site.name,
        description: config.site.description,
        id: config.site.url,
        link: config.site.url,
        image: "", // TODO: Replace with featured image
        favicon: "", // TODO: Replace with favicon
        copyright: "", // TODO: Replace with copyright
        updated: Date.now(),
        generator: "Bulba Static Blog Generator", // optional, default = 'Feed for Node.js'
        feedLinks: {
            json: config.site.url + 'feed.json'
        },
        author: {
            name: config.author.name,
            link: config.author.link
        }
    });
}

module.exports = {
    buildFeed
}