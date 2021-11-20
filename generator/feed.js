#!/usr/bin/env node

const Feed = require('feed').Feed
const fs = require('fs')

function buildFeed(posts, config) {
    var feed = createSiteFeed(config)

    var limit = config.numberOfPostsInFeed || 10
    posts.slice(0, limit).forEach(post => {
        var postUrl = config.site.url + post.meta.slug + '.html'
        feed.addItem({
            title: post.meta.title,
            id: postUrl,
            link: postUrl,
            description: post.meta.excerpt,
            content: post.content,
            author: [{
                name: config.author.name,
                link: config.author.link
            }],
            date: post.meta.date
        })
    })

    const outDir = config.outputDirectory
    fs.writeFileSync(outDir + 'feed.json', feed.json1())
    fs.writeFileSync(outDir + 'feed.xml', feed.rss2())
}

function createSiteFeed(config) {
    return new Feed({
        title: config.site.name,
        description: config.site.description,
        id: config.site.url,
        link: config.site.url,
        image: '', // TODO: Replace with featured image
        favicon: '', // TODO: Replace with favicon
        copyright: '', // TODO: Replace with copyright
        updated: new Date(),
        generator: 'Bulba Static Blog Generator',
        feedLinks: {
            json: config.site.url + 'feed.json',
            rss2: config.site.url + 'feed.xml'
        },
        author: {
            name: config.author.name,
            link: config.author.link
        }
    })
}

module.exports = {
    buildFeed
}