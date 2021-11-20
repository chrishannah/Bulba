# Bulba

## What is this?

A static site generator, built using Node.

## Why is it named Bulba?

Two reasons:

- Bulbasaur is the best Pokemon
- There was a Bulbasaur plushie next to me when I was thinking of a name

## Getting started

To use Bulba, you first need to install it using [npm][npm]:

```
npm install -g @chrishannah/bulba
```

Once you have Bulba installed, you need to run the `bulba init` command in the directory where you want the your blog to be.

This will create an example blog, containing an example blog post, about page, and a config file.

The structure is as below:

```
.
└── blog/
    ├── content/
    │   ├── about.md
    │   ├── posts/
    │   │   └── example.md
    │   └── images/
    │       └── image.png
    └── config.yaml
```

To generate a site using Bulba, you will need to run the `bulba generate` command from the root of the blog directory.

This will then generate a static site in the directory determined from the config file, default is inside a subdirectory named `out` inside your blog directory. 

The outputted site will look something like this:

```
.
└── out/
    ├── assets/
    │   ├── css/
    │   │   └── style.css
    │   └── images/
    │       └── image.png
    ├── archive.html
    ├── about.html
    ├── feed.json
    ├── feed.xml
    └── blog-post.html
```
A few notes on the outputted files:

- Posts will be exported to the base of the `out` directory as `.html` files.
- Required assets will be exported into the assets directory, inside subdirectories noting their type.
- An archive page will be generated with contains a list of all blog posts.
- A [JSON Feed](https://www.jsonfeed.org) will be generated at `feed.json`.
- A [RSS2 Feed](https://www.rssboard.org/rss-specification) will be generated at `feed.xml`.
- The about page will be generated from the `about.md` file located inside the content directory.
- All content inside the `content/images` directory will be exported to the `assets/images/` directory relative to the output directory.

### Post format

Posts should be saved as `.md` files, inside the `content/posts` directory, with the following format:

```
---
title: Example post
slug: example
date: 2010-09-15 14:40:45
excerpt: Just an example blog post.
---

Content
```

The `excerpt` is optional.

### Images

To include images in blog posts, they need to be placed in the `content/images` directory. Everything in this directory will be copied to the `assets/images` directory, with the same folder structure.

For example, for an image named `screenshot.png`, at the following location:

```
blog/content/images/2021/01/01/screenshot.png
```

will be copied to the following location, relative to the output directory:

```
/assets/images/2021/01/01/screenshot.png
```

The latter is the path required to reference an image in a blog post.


### Custom header content

If you want to inject custom HTML in the header in all pages, then you can do this by creating a `header.html` file at the root of your blog directory.

The content of this file will then be injected into every page between the `<head>` tags.


### Config

The config file is where you configure your site information, author details, and a few extra options to customise how the site is generated.

Here is the demo config that is created after running `bulba init`:

```
site:
  name: The name of your blog
  description: A description
  url: https://example.blog
  accentColour: red
author:
  name: Your name
  link: https://example.blog
  twitter: 
postsPerPage: 10
numberOfPostsInFeed: 10
paths: 
  assets:
    assets
outputDirectory: out/
showFullContentOnIndex: true
enableCodeHighlighting: true
enableSearchOnArchivePage: true
```

- **site.name**: The name of your blog. Appears in the header and footer of the site, and also in the JSON feed.
- **site.description**: The name of your blog. Appears in the footer of the site and in the JSON feed.
- **site.url**: The base URL of where your blog is accessible. Used for link generation.
- **site.accentColour**: A accent colour that is used in the theme for styling links, quotes, etc. Supports hex, rgb, and HTML colour names. Defaults to `red`.
- **author.name**: Used in the JSON Feed.
- **author.link**: Used in the JSON Feed.
- **author.twitter**: The full URL of your Twitter account, this will enable a Twitter icon in the footer. Optional.
- **postsPerPage**: This number determines how many posts to put on each of the paginated index pages.
- **numberOfPostsInFeed**: The number of posts that will be included in the syndicated feeds.
- **path.assets**: The relative output directory of asset files used by the site, at the moment this is just the needed `.css` or `.js` files needed for site generation. This is relative to the outputDirectory below.
- **outputDirectory**: The relative output directory for the site content.
- **showFullContentOnIndex**: Setting this to true will show the full blog posts content on index pages, otherwise only the excerpt will be displayed.
- **enableCodeHighlighting**: This enables code highlighting, which is powered by [highlight.js][hjs]. The styles used are `atom-one-dark` and `atom-one-light` depending on the system appearance. If set to false, highlight.js will not be used or linked from your pages.
- **enableSearchOnArchivePage**: Adds a search bar to the top of the archive page. It uses very minimal JavaScript to filter the list based on the query text.

### Deploying the site

At the moment, Bulba is strictly a site generator and nothing else. So there are no built-in deployment tools.

My personal set up for [dev.chrishannah.me][dev] is that I have a server running on Digital Ocean, where I have Bulba installed via npm. I also have a repository for my blog content, which I have checked out on the server. 

So when I want to rebuild my site, or update content, I run `git pull` to fetch any latest changes, then run `bulba generate` to generate the site, followed by a small script that moves the generated files to the correct place.

**Note**: When generationg the site, Bulba will attempt to erase the contents of the configured output directory, ready to generate the fresh site. So be careful if you are customising the outputDirectory in the config file.




[npm]: https://npmjs.com/package/@chrishannah/bulba
[dev]: https://dev.chrishannah.me
[hjs]: https://highlightjs.org