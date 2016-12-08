# SwellRT Pad [![Build Status](https://travis-ci.org/P2Pvalue/jetpad.svg?branch=master)](https://travis-ci.org/P2Pvalue/jetpad) [![Dependency Status](https://david-dm.org/P2Pvalue/jetpad.svg)](https://david-dm.org/P2Pvalue/jetpad) [![Chat on Matrix](https://img.shields.io/badge/chat-on%20matrix-brightgreen.svg)](https://riot.im/app/#/room/#jetpad:matrix.org)

SwellRT Pad is a web-based collaborative editor, build with [SwellRT real-time technology](http://swellrt.org) and the Angular 2 framework.

## Installation

Install *node.js* and *npm* package manager in order to download the dependencies. Then, do:

```
git clone git://github.com/p2pvalue/swellrt-pad
cd swellrt-pad
npm i -g typings esformatter protractor webpack webpack-dev-server karma protractor typings typescript webpack-merge webpack copy-webpack-plugin html-webpack-plugin awesome-typescript-loader autoprefixer angular2-template-loader hmr-loader
npm i
```

## Run

You can run it in dev mode with:

```
npm start
```

The server is running now at http://localhost:3000/

## Build

If you want to build the project, do:

```
npm run build
```

## SwellRT Server

By default, it is going to be connected to the SwellRT demo server.

If you want to install your own SwellRT server, please visit the [SwellRt Readme](https://github.com/p2pvalue/swellrt). Then, you need to change SwellRT Pad configuration:

You can found the script configuration in `src/index.html`.
You can found the server configuration in `src/main.browser.ts`.
You can found the domain configuration in `src/app/environment.ts`.

## Dependencies

SwellRT Pad uses Webpack 1.x (current version is 1.13.3). In order to manage project dependencies you should use npm system
or add directly the new dependency in *package.json* file:

```
  npm install dependency --save
```

```
"dependencies": {
    "@angular/common": "2.0.0",
    "@angular/compiler": "2.0.0",
    "@angular/core": "2.0.0",
    "@angular/forms": "2.0.0",
    "@angular/http": "2.0.0",
    "@angular/platform-browser": "2.0.0",
    "@angular/platform-browser-dynamic": "2.0.0",
    "@angular/platform-server": "2.0.0",
    "@angular/router": "3.0.0",
    "angular2-clipboard": "1.0.1",
    "angular2-template-loader": "^0.4.0",
    "angular2-ui-switch": "1.1.0",
    "bootstrap": "^3.3.7",
    "bootstrap-material-design": "^0.5.10",
    "bootstrap-sass": "^3.3.7",
    "core-js": "^2.4.1",
    "http-server": "^0.9.0",
    "ie-shim": "^0.1.0",
    "ng2-bootstrap": "^1.1.16",
    "ng2-dropdown": "^0.0.12",
    "ng2-modal": "0.0.20",
    "ng2-sharebuttons": "^1.1.1",
    "rxjs": "5.0.0-beta.12",
    "zone.js": "^0.6.23"
  },

```

The project's layout is based in [AngularClass starter](https://github.com/AngularClass/angular2-webpack-starter). The configuration is hosted
completely under ```config``` folder of the project. There are three types of configuration: *dev*, *prod* and *test*. Also there is a configuration
for unit test managed by *Karma* and E2E tests based in protractor.

### Bootstrap
The project uses *Bootstrap* as UI framework. The current version is 3.3.7. The project also uses the [bootstrap-material-design](http://fezvrasta.github.io/bootstrap-material-design/) 
modules and [bootstrap-sass](https://github.com/twbs/bootstrap-sass) module.

Bootstrap also requires *Jquery*. The version imported with the project is 1.9.1. The *Sass* styles are defined in ```src/assets``` folder and the main file is
```src/app/app.style.scss```.

In order to use bootstrap seamless within Angular2 application we imported [ng2-bootstrap](https://github.com/valor-software/ng2-bootstrap) library to have
native directives for Angular2 project.

Currently the project is not implementing Angular components as Web Components. The configuration in *app.component.ts*, 
main component of the application set up the encapsulation property as ```encapsulation: ViewEncapsulation.None```. This way all defined
sytles will be prepended in style elements in the head of the application. The transformation of sass styles to pure CSS is made up by webpack loaders: 
[css-loader](https://github.com/webpack/css-loader), [css-to-string-loader](https://www.npmjs.com/package/css-to-string-loader), 
[resolve-url](https://www.npmjs.com/package/resolve-url-loader) and [sass-loader](https://github.com/jtangelder/sass-loader).

### Modals
In order to show modals we are using [ng2-modal](https://github.com/pleerock/ng2-modal) but the project wants to migrate this library to 
[ng2-bootstrap-modal](http://valor-software.com/ng2-bootstrap/#/modals).

## Copyright and License

Code and documentation copyright 2016 [Pablo Ojanguren](https://github.com/pablojan) and [David Llop](https://github.com/llopv). Code released under the Affero GPL v3 license, and docs released under the GNU Free Documentation License.
