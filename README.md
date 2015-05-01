# [gulp](https://github.com/gulpjs/gulp)-[kelp](https://github.com/stellar/kelp)

> A gulp plugin to build the [kelp framework](https://github.com/stellar/kelp)

This plugin builds the kelp framework css and js. It follows the build process laid out in the [kelp build overview](https://github.com/stellar/kelp/blob/master/docs/kelp-overview.md). It uses the kelp

## Install
Install with [npm](https://www.npmjs.com/package/gulp-kelp)

```sh
npm install --save-dev gulp-kelp
```

## Example usage
This plugin was timeboxed and not fully finished. However, it still works.

JS compile is currently not supported.

```js
var gulp = require('gulp');
var kelp = require('gulp-kelp');
var async = require('async');
var sass = require('gulp-sass');

gulp.task('kelpCss', function(gulpCallback) {
  var kelpExtensions = ['kelp', 'kelp-theme-sdf'];
  var packetTmpDir = '.tmp/kelp-packet/';
  var bundleTmpDir = '.tmp/kelp-bundle/';
  var distDir = 'dist/css';

  async.series([
    function(callback){
      kelp.packet(kelpExtensions)
        .pipe(gulp.dest(packetTmpDir))
        .on('end', callback)
    },
    function(callback){
      kelp.bundle(kelpExtensions)
        .pipe(gulp.dest(bundleTmpDir))
        .on('end', callback)
    },
    function(callback){
      gulp.src(bundleTmpDir + '/**/*.scss')
        .pipe(sass({
          includePaths: [packetTmpDir]
        }))
        .pipe(gulp.dest(distDir + '/bundle'))
        .on('end', callback)
    },
    function(callback){
      gulp.src('widgets/**/*.scss')
        .pipe(sass({
          includePaths: [packetTmpDir]
        }))
        .pipe(gulp.dest(distDir + '/widgets'))
        .on('end', callback)
    },
    function(callback){
      gulp.src('app/**/*.scss')
        .pipe(sass({
          includePaths: [packetTmpDir]
        }))
        .pipe(gulp.dest(distDir + '/app'))
        .on('end', callback)
    }, function(callback){
      gulpCallback();
    }]
  );
});
```

## API: Kelp.css
```js
gulp.src('path/to/**/*.scss')
  .pipe(kelp.css(options))
```
Takes in a stream of scss files and returns the processed files. It also creates the kelp bundle and includes it at the beginning of the file stream.

### options.extensions
Type: `String` or `Array`
Default: `[]`

Names of the kelp extensions you are using. The order of the array will determine the order in which the extensions are built. You must also have these extensions in your package.json.

### options.tmpDir
Type: `String`
Default: `.tmp/kelp`

Sets the directory in which the temporary css files are stored. This directory is used to store the input scss files since ruby sass

## Kelp JS
```js
gulp.src(kelp.js({
    extensions: ['kelp-theme-base', 'kelp-theme-sdf'],
  }))
  .pipe(gulp.dest('./dist/js')
```
Kelp js files do not need any transformations. `kelp.js()` simply returns an array of the parent directory of the kelp js files.

This may change in the future as kelp js may need a build system.

## Behind the scenes
This plugin implements the kelp compile process laid out in the [kelp build overview](https://github.com/stellar/kelp/blob/master/docs/kelp-overview.md).

### css()
1. Copy the input scss to the tmp folder
2. Create the kelp-packet in the tmp folder
3. Create the kelp-bundle in the tmp folder
4. Compile the kelp bundle scss files
5. Compile the input scss files
6. Clean the tmp files
7. Rebuild and return as a stream

### js()
1. For each specified extension, get the js folder path (if exists)
2. return
