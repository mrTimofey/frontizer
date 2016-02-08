# Node.js frontend platform

Node.js based tool for effective frontend development.

Includes stylus, browserify, es6, jade.

## Installation and configuration

```
npm i
node init [--appPort={application port}] [--livereloadPort={livereload port}]
```

This will install all needed npm packages, create main style and JavaScript files and initilize config.

Default configuration uses 3000 as appPort and 35729 as livereloadPort

## Running

To start develop you simply have to run:

```
npm start
```

## CLI

* **npm start** - runs watchers, livereload and application servers in parallel
* npm run js - compile JS/ES6 sources
* npm run styles - compile Stylus sources
* npm run styles:watch - styles watcher
* npm run js:watch - scripts watcher
* npm run server - application server
* npm run livereload - livereload server

### Static build

You can create a fully static build with html files and assets included with command:

`npm run build`

Static build can be found in *build* directory.

## Assets

Assets folder contains all statics and source files for your project. Main files are used as a starting points
for compiling, browserifying and publishing. Published files are placed inside *assets/compiled* directory.

### Client JavaScript and ECMAScript 6

Either ordinary JavaScript or ECMAScript 6 can be used simultaneously. All files with *.es6* extension will
be precompiled by Babel. Main script file is *main.es6*. Use it to import all needed deps.

## Views

Views folder contains your jade templates. Each file here represents it's own route which is the same as file name.
The one exception is *home.jade* which represents a home page.

View based routing examples:

* home.js - /
* foo/bar.jade - /foo/bar
* foo/home.jade - /foo

### Including assets

Write *__css* in the *head* inside your layout to add styles.

Write *__js* in the layout wherever you need to add compiled js (recommnded: in the end of the *body*).

## Data

You can provide any data to your views by creating data files. They will be fetched in the same way as view.
*export* object fields will be variables in views.

Data shared with corresponding view also includes data from upper levels home files.
For example, route /foo/bar will use *views/foo/bar.jade* view and try to fetch and merge files:

1. data/home.js
2. data/foo.js
3. data/foo/bar.js

Obviously, *data/home.js* file will be fetched on every route so you can use it to provide global data and defaults.

## View helpers

* range([from], to) - generates an array of numbers from first parameter to second; first parameter can be omitted so it will be equal to 1 by default. Examples:
  * range(3, 5) -> [3, 4, 5]
  * range(5) -> [1, 2, 3, 4, 5]
* static('file-name') - prepends static assets root to the file name
  * static('example.jpg') -> '/assets/static/example.jpg'
* linkTo('view-name') - returns a proper link to the view (there are different for static build and application)
  * linkTo('home') -> '/', static builds: 'home.html'
  * linkTo('my/page') -> '/my/page', static builds: 'my.page.html'

You can define your own helpers in data files.

## Livereload

Write *__livereload* in your layout view just before in the end of the *body* tag.

## NPM modules

* Request handling: [Express](http://expressjs.com)
* Templating: [Jade](http://jade-lang.com)
* Styles: [Stylus](http://learnboost.github.io/stylus/) with [kouto-swiss](http://kouto-swiss.io)
* Client JavaScript:
	[Browserify](http://browserify.org),
	[Watchify](https://github.com/substack/watchify),
	[Babelify](https://github.com/babel/babelify) with
	[ES2015 preset](https://github.com/babel/babel/tree/master/packages/babel-preset-es2015)
* Utility:
	[Livereload](https://github.com/napcs/node-livereload),
	[Parallelshell](https://github.com/keithamus/parallelshell),
	[Serve-favicon](https://github.com/expressjs/serve-favicon),
	[jstransformer-stylus](https://github.com/jstransformers/jstransformer-stylus),
	[ncp](https://github.com/AvianFlu/ncp)