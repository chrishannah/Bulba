# Bulba

## What is this?

A static site generator, built using Node.

## Why is it named Bulba?

Two reasons:

- Bulbasaur is the best Pokemon
- There was a Bulbasaur plushie next to me when I was thinking of a name

## Usage

Bulba has a very minimal directory structure:

```
.
└── blog/
    ├── content/
    │   └── posts/
    │       └── example.md
    └── config.yaml
```

### Post format

Posts should be saved as `.md` files, with the following format:

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

### Output directory

- Posts will be exported to the base of the `out` directory as `.html` files.
- Required assets will be exported into the assets directory, inside subdirectories noting their type.
- An archive page will be generated with contains a list of all blog posts.
- A [JSON Feed](https://www.jsonfeed.org) will be generated at `feed.json`.

Example:

```
.
└── out/
    ├── assets/
    │   └── css/
    │       └── style.css
    ├── archive.html 
    ├── feed.json 
    └── blog-post.html
```