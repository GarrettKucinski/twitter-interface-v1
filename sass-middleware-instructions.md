The connect middleware from node-sass has been extracted into node-sass-middleware, see this answer

## Install node-sass

### In you project folder run:

```bash
$ npm install node-sass
Modify app.js
```

### Assuming you have generated your app using

```bash
$ express my_app
```
 
### Your app.js should look somewhat like this:

```javascript
var express = require('express'),
    routes  = require('./routes');

var app = module.exports = express.createServer();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});
```

### Here are the modifications:

```javascript
var express = require('express'),
    routes  = require('./routes'),
    sass    = require('node-sass'), // We're adding the node-sass module
    path    = require('path');      // Also loading the path module

var app = module.exports = express.createServer();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);

  // notice that the following line has been removed
  // app.use(express.static(__dirname + '/public'));

  // adding the sass middleware
  app.use(
     sass.middleware({
         src: __dirname + '/sass', 
         dest: __dirname + '/public',
         debug: true,       
     })
  );   

  // The static middleware must come after the sass middleware
  app.use(express.static( path.join( __dirname, 'public' ) ) );
});
It is important to note that

app.use( sass.middleware ... );
must come before

app.use( express.static ... )
```

The reason is that we first want sass to compile any sass files that has changed, only then serve them (which is done by express.static).

### Restart your app

You'd have to restart your app in order for these changes to take place.

Include it somewhere so it compiles

We can now include app.scss in our /sass folder. But it won't compile just yet. The sass middleware will only compile files that are requested by your applications, so we must include the (to be rendered) css file somewhere, like in `/views/layout.jade':

```javascript
doctype html
html(lang="en")
  head
    title= title
    link(rel='stylesheet', href='/stylesheets/style.css')
    link(rel="stylesheet", href="app.css")                 < we've added this
  body!= body `/views/layout.jade`
```

Notice that unlike style.css which is under the stylesheets sub-folder, the app.css is read from the root (in this case /public).

### Fixing paths

With

```javascript
  app.use(
     sass.middleware({
         src: __dirname + '/sass', 
         dest: __dirname + '/public',
         debug: true,       
     })
  );
```

After the first compilation, the file and folder hierarchy will look like so:

```
Project folder
    app.js
    public
        app.css           < This is where the compiled file goes
        sytlesheets
            style.css
    sass
        app.scss          < This is where the sass file is
```

You may want to have the compiled output in the stylesheets folder, rather than the public one; like so:

```
Project folder
    app.js
    public
        sytlesheets
            app.css
            style.css
    sass
        app.scss
```

This way, the view will link to the css files like so:

```javascript
link(rel='stylesheet', href='/stylesheets/style.css')
link(rel="stylesheet", href="/stylesheets/app.css")
```

However, if you change the sass middleware configuration to

```javascript
  app.use(
     sass.middleware({
         src: __dirname + '/sass', 
         dest: __dirname + '/public/stylesheets',
         debug: true,       
     })
  );
```

things will go pear shape.

When linking to the css file like so:

```javascript
link(rel="stylesheet", href="stylesheets/app.css")
```

the resultant request will be for stylesheets/app.css. But since we gave the sass middleware the following config:

```javascript
src: __dirname + '/sass',
```

it will go and look for /sass/stylesheets/app.scss, and no such file exists.

One solution is to keep the config as is, but the put all sass files in the subfolder `/sass/stylesheets/. But there is a better solution.

If you define a prefix config like so:

```javascript
app.use(
    sass.middleware({
        src: __dirname + '/sass', 
        dest: __dirname + '/public/stylesheets',
        prefix:  '/stylesheets',                    // We've added prefix
     })
);  
```

it will tell the sass compiler that request file will always be prefixed with /stylesheets and this prefix should be ignored, thus for a request for /stylesheets/app.css, the sass middleware will look for the file /sass/app.scss rather than /sass/stylesheets/app.scss.

### Final code

app.js

```javascript
var express = require('express'),
    routes  = require('./routes'),
    sass    = require('node-sass'),
    path    = require('path');

var app = module.exports = express.createServer();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);

  app.use(
     sass.middleware({
         src: __dirname + '/sass', 
         dest: __dirname + '/public/stylesheets',
         prefix:  '/stylesheets',
         debug: true,         
     })
  );   

  app.use(express.static(path.join(__dirname, 'public')));

});
```

### layout.jade

```javascript
doctype html
html(lang="en")
  head
    title= title
    link(rel='stylesheet', href='/stylesheets/style.css')
    link(rel="stylesheet", href="/stylesheets/app.css")
  body!= body
```

### Folders and files
```
Project folder
    app.js
    public
        sytlesheets
            app.css
            style.css
    sass
        app.scss
```
