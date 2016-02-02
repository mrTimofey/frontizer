# Node.js frontend platform

Node.js based tool for effective frontend development.

## Installation and configuration

```
npm install
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

* npm run js - browserify and publish JavaScript sources
* npm run styles - compile and publish stylus sources
* npm run jshint - check all client JavaScript sources with jshint
* npm run styles:watch - styles watcher
* npm run js:watch - client JavaScript watcher
* npm run server - application server
* npm run livereload - livereload server

*npm start* command executes watchers and servers in parallel, so you do not need to run them directly.

## Assets

Assets folder contains all statics and source files for your project. Main files are used as a starting points
for compiling, browserifying and publishing. Published files are placed inside *assets/compiled* directory.

## Views

Views folder contains your jade templates. Each file here represents it's own route which is the same as file name.
The one exception is *home.jade* which represents a home page.

View based routing examples:

* home.js - /
* foo/bar.jade - /foo/bar
* foo/home.jade - /foo

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
  
You can define your own helpers in data files.

## Livereload

To enable livereload feature just include *script(src=__livereload)* in view.

## NPM modules

* Request handling: [Express](http://expressjs.com)
* Templating: [Jade](http://jade-lang.com)
* Styles: [Stylus](http://learnboost.github.io/stylus/) with [kouto-swiss](http://kouto-swiss.io)
* Client JavaScript: [Browserify](http://browserify.org), [Watchify](https://github.com/substack/watchify), [jshint](http://jshint.com)
* Utility:
	[Livereload](https://github.com/napcs/node-livereload),
	[Parallelshell](https://github.com/keithamus/parallelshell),
	[Serve-favicon](https://github.com/expressjs/serve-favicon),
	[jstransformer-stylus](https://github.com/jstransformers/jstransformer-stylus)