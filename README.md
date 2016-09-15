# Frontizer

Node.js based tool for effective frontend development.

Includes stylus, browserify, es6, jade for now.
Future builds will allow you to use your own modules.

*All projet directories are configurable and you can disable express app as well in case you need only
compilation and watchers (just do not forget to add livereload link manually if you need it).*

## Usage

1. Install the module globally: `npm i -g frontizer`

2. Create a folder for your new project and enter it.

3. Initialize your new project with `frontizer init` than run it with `frontizer start`.

**Type `frontizer` to see help.**

## Assets

Assets folder contains all statics and source files for your project.
Compiled assets are placed inside *assets/compiled* directory by default.

### Client JavaScript and ECMAScript 6

Either ordinary JavaScript or ECMAScript 6 can be used simultaneously.
All files with *.es6* extension will be precompiled by Babel.

## Views

Views folder contains your templates. Each file here represents it's own route which is the same as a file name.
The one exception is *index.pug* which represents a home page.

View based routing examples:

* index.js - /
* foo/bar.pug - /foo/bar
* foo/home.pug - /foo

### Predefined variables

* *__css* contains ready to use <link> tags with compiled css links
* *__js* same for JavaScript
* *__livereload* contains link to a JavaScript file necessary for livereloading

### Helper functions

* range([from], to) - generates an array of numbers from first parameter to second; first parameter can be omitted so it will be equal to 1 by default. Examples:
  * range(3, 5) -> [3, 4, 5]
  * range(5) -> [1, 2, 3, 4, 5]
* static('file-name') - prepends static assets root to the file name
  * static('example.jpg') -> '/assets/static/example.jpg'
* linkTo('view-name') - returns a proper link to the view (there are different for static build and application)
  * linkTo('index') -> '/', static builds: 'index.html'
  * linkTo('my/page') -> '/my/page', static builds: 'my.page.html'

## Data

You can provide any data to your views by creating data files. They will be fetched in the same way as view.
*exports* object fields will be variables in views.

Data shared with corresponding view also includes data from upper levels index files.
For example, route /foo/bar will uses *foo/bar* view and tries to fetch and merge files:

1. index.js
2. foo.js
3. foo/bar.js

Obviously, *index.js* file will be fetched on every route so you can use it to provide global data and defaults.

Any duplicated data field names will be overwritten by lower level data.

## NPM modules

* Request handling: [Express](http://expressjs.com)
* Templating: [Pug](http://jade-lang.com)
* Styles: [Stylus](http://learnboost.github.io/stylus/) with [kouto-swiss](http://kouto-swiss.io)
* Client JavaScript:
	[Browserify](http://browserify.org),
	[Watchify](https://github.com/substack/watchify),
	[Babelify](https://github.com/babel/babelify) with
	[ES2015 preset](https://github.com/babel/babel/tree/master/packages/babel-preset-es2015)
* Utility:
	[Livereload](https://github.com/napcs/node-livereload),
	[Serve-favicon](https://github.com/expressjs/serve-favicon),
	[jstransformer-stylus](https://github.com/jstransformers/jstransformer-stylus),
	[ncp](https://github.com/AvianFlu/ncp)