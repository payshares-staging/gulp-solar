# [gulp](https://github.com/gulpjs/gulp)-[solar](https://github.com/stellar/solar)

> A gulp plugin to build the [solar css framework](https://github.com/stellar/solar)

This plugin builds the solar framework css and js. It follows the build process laid out in the [solar build overview](https://github.com/stellar/solar/blob/master/docs/solar-overview.md).

This plugin is currently a hack and is not finished. The goal is that this will return just a scss library bundle and a css file.

## Install
Install with [npm](https://www.npmjs.com/package/gulp-solar)

```sh
npm install --save-dev gulp-solar
```

## Example usage
This plugin was timeboxed and not fully finished. It is inefficient (running libraryBundle twice) and incomplete (does not parse the scss), but it still works.

JS compile is currently not supported.

```js
var gulp = require('gulp');
var solar = require('gulp-solar');
var async = require('async');
var sass = require('gulp-sass');

gulp.task('solarCss', function(gulpCallback) {
  var solarExtensions = ['solar', 'solar-stellarorg'];
  var libraryBundleTmpDir = '.tmp/solar-library-bundle/';
  var cssBundleTmpDir = '.tmp/solar-css-bundle/';
  var distDir = 'dist/css';

  async.series([
    function(callback) {
      solar.libraryBundle(solarExtensions)
        .pipe(gulp.dest(libraryBundleTmpDir))
        .on('end', callback)
    },
    function(callback) {
      solar.cssBundle(solarExtensions)
        .pipe(gulp.dest(cssBundleTmpDir))
        .on('end', callback)
    },
    // waiting in between here is necessary
    function(callback) {
      gulp.src(cssBundleTmpDir + '/**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer(config.autoprefixer))
        .pipe(gulp.dest(distDir))
        .on('end', callback)
    },
    function(callback) {
      gulp.src('widgets/**/*.scss')
        .pipe(sass({
          includePaths: [libraryBundleTmpDir]
        }))
        .pipe(concat('widgets.css'))
        .pipe(autoprefixer(config.autoprefixer))
        .pipe(gulp.dest(distDir))
        .on('end', callback)
    },
    function(callback) {
      gulp.src('app/**/*.scss')
        .pipe(sass({
          includePaths: [libraryBundleTmpDir]
        }))
        .pipe(concat('app.css'))
        .pipe(autoprefixer(config.autoprefixer))
        .pipe(gulp.dest(distDir))
        .on('end', callback)
    }, function(callback) {
      gulpCallback();
    }]
  );
});
```


## API
This plugin implements the solar compile process laid out in the [solar build overview](https://github.com/stellar/solar-css/blob/master/docs/overview.md).

### solar.libraryBundle()
Returns a stream containing a `_solar-library-bundle.scss` that imports a few library files from library subfolders.

### solar.cssBundle()
Returns a stream containing a `solar-css-bundle.scss` that can be compiled by sass into a css file.

### options.extensions
Type: `String` or `Array`
Default: `[]`

Names of the solar extensions you are using. The order of the array will determine the order in which the extensions are built. You must also have these extensions in your package.json.

### options.tmpDir
Type: `String`
Default: `.tmp/solar`

Sets the directory in which the temporary css files are stored. This directory is used to store the input scss files since ruby sass

<!--
## Solar JS
```js
gulp.src(solar.js({
    extensions: ['solar-stellarorg'],
  }))
  .pipe(gulp.dest('./dist/js')
```
Solar js files do not need any transformations. `solar.js()` simply returns an array of the parent directory of the solar js files.

This may change in the future as solar js may need a build system.
-->
