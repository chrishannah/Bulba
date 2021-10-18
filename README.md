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
├── content/
│   └── posts                posts saved as .md files
└── assets                   asset files such as css stylesheets
```

### Post format

Posts should be saved as `.md` files, with the following format:

```
---
title: Example post
slug: example
date: 2010-09-15 14:40:45
---

Content
```

These will be exported to the base of the `out` directory as `.html` files. Assets are also organised by their types. 

Example:

```
.
└── out/
    ├── assets/
    │   └── css/
    │       └── style.css
    └── blog-post.html
```