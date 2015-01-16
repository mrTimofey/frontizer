# Node.js Boilerplate
Frontend Node.js based boilerpalte.

This boilerplate can be used for fast frontend project development.

Modules involved:
* Express for routing and statics
* Handlebars for html templates
* Grunt for background processes and livereload
* SASS and autoprefixer

## Installation

After you downloaded or cloned this repo go to project folder in command line and run
```
npm install
```

That's it! It is ready to be used.

## Starting

Go to project folder in command line and just run
```
grunt
```

## How to use

Node server will listen to 3000 port after starting so you can open http://localhost:3000 to see result.

### Static files

All static files must be places in "public" directory. Request URL's to these files must not contain "public" part.
For example, "public/css/main.css" file must be requested with URL "/css/main.css".

### Assets

Assets are placed in the "assets" directory. JS files will be just copied to "public/js" directory.
"assets/sass/main.sass" file will be processed with SASS and autoprefixer.
Use @include to include other SASS files or external CSS.
Output CSS file will be placed in "public/css/main.css".

### Templates

All template files must be placed in *views* directory. Page layouts are in *views/layouts* directory.
Layout *main.htm* is used by default if layout is not specified so do not delete it.

To specify different page layout for template you can use *layout* param in template data.
Value must be a layout file name without extension.

Inside a page layout use a code *{{{body}}}* to include template output. See full documentation for Handlebars in
http://handlebarsjs.com.

Use a code *{{{__livereload}}}* inside layout just before closing body tag to use livereload feature.

### Template data

You can pass a data to template. Create a file with same name and path as your template file but inside *data* directory.
For example, for template *views/blog/discussions.htm* you can create *data/blog/discussions.js* file to pass data
to this template.

Data file must contain a code like
```javascript
module.exports = { foo: "bar" };
```

If you want to output data you can use *{{foo}}* code in your template. More about templates syntax: http://handlebarsjs.com.

Also you can provide a layout name here with key *layout*.
