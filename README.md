# SwellRT Pad [![Build Status](https://travis-ci.org/P2Pvalue/swellrt-pad.svg?branch=master)](https://travis-ci.org/P2Pvalue/swellrt-pad) [![Dependency Status](https://david-dm.org/P2Pvalue/swellrt-pad.svg)](https://david-dm.org/P2Pvalue/swellrt-pad) [![Chat on Matrix](https://img.shields.io/badge/chat-on%20matrix-brightgreen.svg)](https://riot.im/app/#/room/#jetpad:matrix.org)

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

## Copyright and License

Code and documentation copyright 2016 [Pablo Ojanguren](https://github.com/pablojan) and [David Llop](https://github.com/llopv). Code released under the Affero GPL v3 license, and docs released under the GNU Free Documentation License.
