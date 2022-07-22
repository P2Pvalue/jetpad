# JetPad [![Build Status](https://travis-ci.org/P2Pvalue/jetpad.svg?branch=master)](https://travis-ci.org/P2Pvalue/jetpad) [![Dependency Status](https://david-dm.org/P2Pvalue/jetpad.svg)](https://david-dm.org/P2Pvalue/jetpad) [![Chat on Matrix](https://img.shields.io/badge/chat-on%20matrix-brightgreen.svg)](https://riot.im/app/#/room/#jetpad:matrix.org)

JetPad is a web-based collaborative text editor built with [SwellRT real-time technology](http://swellrt.org) and the Angular 2 framework.

## Installation

Install *node.js* and *npm* package manager in order to download the dependencies. Then, do:

```
git clone git@github.com:P2Pvalue/jetpad.git
cd jetpad
npm i
```

## Run

You can run it in dev mode with:

```
npm start
```

The server is running now at http://localhost:3000/

## Build

If you want to build the project in dev mode, do:

```
npm run build
```

For production ready build, do:

```
npm run build:prod
```

Output files will be placed in '/dist' folder.

## SwellRT Server

JetPad requires SwellRT as backend server. To setup a SwellRT server, please visit the [SwellRT Readme](https://github.com/p2pvalue/swellrt).

If you run JetPad in dev mode (`npm start`) the index file
`index.html` will point to `localhost:9898`, the default SwellRT development endpoint. For other scenarios
edit `index.html` to adjust the endpoint to `swellrt.js`.

## Nginx  

When using Nginx as fronted server for JetPad, use following configuration to cache resources properly:

```
server {
        listen 80;
        listen [::]:80;

        server_name     jetpad.local.net;

        root /var/www/jetpad;
        index index.html;

        location / {
                try_files $uri$args $uri$args/ $uri/ /index.html =404;
                add_header Cache-Control must-revalidate;
        }

        location /assets {
                etag on;        
        }

        location ~ \.bundle\.js$ {
                add_header Cache-Control public;
                etag off;
                expires max;
                gzip on;
                gzip_types application/javascript;
        }
}

```

## Dependencies

JetPad uses Webpack 2. In order to manage project dependencies you should use npm system or add directly the new dependency in *package.json* file:

```
  npm install <dependency> --save
```

The project's layout is based in [AngularClass starter](https://github.com/AngularClass/angular2-webpack-starter). The configuration is hosted completely under ```config``` folder of the project. There are three types of configuration: *dev*, *prod* and *test*. Also there is a configuration for unit test managed by *Karma* and E2E tests based in protractor.


### Bootstrap

The project uses *Bootstrap* as UI framework. The current version is 3.3.7. The project also uses the [bootstrap-material-design](https://mdbootstrap.com/)
modules and [bootstrap-sass](https://github.com/twbs/bootstrap-sass) module.

Bootstrap also requires *Jquery*. The version imported with the project is 1.9.1. The *Sass* styles are defined in ```src/assets``` folder and the main file is ```src/app/app.style.scss``` .

Currently the project is not implementing Angular components as Web Components. The configuration in *app.component.ts*, main component of the application set up the encapsulation property as ```encapsulation: ViewEncapsulation.None```. This way all defined sytles will be prepended in style elements in the head of the application. The transformation of sass styles to pure CSS is made up by webpack loaders:
[css-loader](https://github.com/webpack/css-loader), [css-to-string-loader](https://www.npmjs.com/package/css-to-string-loader),
[resolve-url](https://www.npmjs.com/package/resolve-url-loader) and [sass-loader](https://github.com/jtangelder/sass-loader).


## Copyright and License

Code and documentation copyright 2016-2017 [Pablo Ojanguren](https://github.com/pablojan), [David Llop](https://github.com/llopv), [Alejandro Garrido](https://github.com/alexseik) and University Complutense of Madrid. Code released under the Affero GPL v3 license. Doc licensed under CC BY 4.0.
