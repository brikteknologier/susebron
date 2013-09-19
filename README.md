# Susebron

A colorscheming middleware for stylus

## wat

Susebron will read a file or accept an object of a format defined below in order
to supply some variables and prepend some settings when compiling your stylus
styles. This is useful if you have a gread clump of stylus for styling your site
that uses variables to define the colours

## api

```javascript
var susebron = require('susebron');
var stylus = require('stylus');
var myStylus = "body { background-color: dark_col }";
var style = {
  defs: {
    light_col: "#FFF",
    dark_col: "#000"
  }
};
var css = stylus(myStylus).use(susebron(style)).render()
```

## install

```
npm install susebron
```

## style format

You can pass susebron an object or a string pointing to a JSON file. The object
can have the following keys:

* `light` (optional): if set to true, it will inverse the `lighten` and `darken`
  stylus functions.
* `prepend` (optional): a string of stylus to render before rendering the rest.
* `defs` (required): an object with a set of variable definitions. this is where
  you should define your colours.

