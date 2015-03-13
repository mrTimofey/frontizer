# Node.js Boilerplate

Frontend Node.js based boilerpalte.

It can be used for fast frontend project development.

Modules involved:
* Request handling: [Express](http://expressjs.com)
* Templating: [Jade](http://jade-lang.com)
* Styles: [Stylus](http://learnboost.github.io/stylus/) with [nib](http://nibstyl.us)
* Client scripts: [Browserify](http://browserify.org), [Bower](http://bower.io), [Debowerify](https://github.com/eugeneware/debowerify), [jshint](http://jshint.com)
* Utility: [Livereload](https://github.com/napcs/node-livereload), [Watch](https://github.com/mikeal/watch), [Parallelshell](https://github.com/keithamus/parallelshell), [Serve-favicon](https://github.com/expressjs/serve-favicon)

## Installation and configuration

Open console and change current directory to the project than execute

```
npm install
```

Create files "assets/js/main.js" and "assets/styles/main.styl".

## Starting and CLI

Open console and change current directory to the project than execute

```
npm run start
```

This will run all related tasks and your project will be available at 3000 port. Also port 35729 will be used for livereload feature.

Port configuration will be available soon.

To run jshint execute

```
npm run jshint
```

## Templates

All template files must be stored inside "views" directory. Their names will be used in routing.

Example: "/about/career" request will be handled with "views/about/career.jade" template.

If corresponding template is not found then you will see error page with 404 status.

For the front page create "home.jade" template.

## Assets and static files

Project assets and statics are stored in "assets" directory with obviously named directories inside.

Use *script(src=__js)* and *link(rel="stylesheet" href=__css)* to include compiled scripts and styles.

Use function *static(path)* in your jade tempates for static URLs. Path argument must not contain leading slash.

## Template data

You can pass variables to templates using files named same as templates but inside "data" directory. Available variables are *module.exports* object properties.

Example: "/about/career" request will be handled with "views/about/career.jade" template with data defined in "data/about/career.js" in *module.exports*.

## Livereload

To enable livereload feature just include *script(src=__livereload)* in your jade templates.

## Bower components

You can use bower to install client-side dependencies. To include them in your scripts you can use *require* function provided by browserify. Debowerify allows you to include bower components by using just *require(<component name>)* without path (e.g. *require('jquery')*) 

Use "./some-script.js" to include local script files inside "assets/js" directory.