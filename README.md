# SwellRT Pad ![Codeship Status for devialab/swellrt-pad](https://codeship.com/projects/fa4d1720-3d44-0134-f92e-4248a514221b/status?branch=master)

SwellRT Pad is a web-based collaborative editor, build with [SwellRT real-time technology](http://swellrt.org) and the Angular 2 framework.

## Installation

Install *node.js* and *npm* package manager in order to download the dependencies. Then, do:

```
git clone git://github.com/p2pvalue/swellrt-pad
cd swellrt-pad
npm i -g typings esformatter protractor webpack webpack-dev-server karma protractor typings typescript
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

If you want to install your own SwellRT server, please visit the [SwellRt Readme](https://github.com/p2pvalue/swellrt). By now, the URL is hardcoded in several places of the app, i.e. in `index.html`.

## Copyright and License

Code and documentation copyright 2016 [Pablo Ojanguren](https://github.com/pablojan) and [David Llop](https://github.com/llopv). Code released under the Affero GPL v3 license, and docs released under the GNU Free Documentation License.
