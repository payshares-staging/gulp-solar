# [gulp](https://github.com/gulpjs/gulp)-[kelp](https://github.com/stellar/kelp)

> A gulp plugin to build the [kelp framework](https://github.com/stellar/kelp)

This plugin builds the kelp framework css and js. It follows the build process laid out in the [kelp build overview](https://github.com/stellar/kelp/blob/master/docs/kelp-overview.md).

This plugin is currently not finished yet especially. The final product will return just a scss library bundle and a css file.

## Install
Install with [npm](https://www.npmjs.com/package/gulp-kelp)

```sh
npm install --save-dev gulp-kelp
```

## Example usage
This plugin was timeboxed and not fully finished. It is inefficient (running libraryBundle twice) and incomplete (does not parse the scss), but it still works.

JS compile is currently not supported.

```js
var gulp = require('gulp');
var kelp = require('gulp-kelp');
var async = require('async');
var sass = require('gulp-sass');

gulp.task('kelpCss', function(gulpCallback) {
  var kelpExtensions = ['kelp', 'kelp-theme-sdf'];
  var libraryBundleTmpDir = '.tmp/kelp-library-bundle/';
  var cssBundleTmpDir = '.tmp/kelp-css-bundle/';
  var distDir = 'dist/css';

  async.series([
    function(callback){
      kelp.libraryBundle(kelpExtensions)
        .pipe(gulp.dest(libraryBundleTmpDir))
        .on('end', callback)
    },
    function(callback){
      kelp.cssBundle(kelpExtensions)
        .pipe(gulp.dest(cssBundleTmpDir))
        .on('end', callback)
    },
    // waiting in between here is necessary
    function(callback){
      gulp.src(cssBundleTmpDir + '/**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer(config.autoprefixer))
        .pipe(gulp.dest(distDir))
        .on('end', callback)
    },
    function(callback){
      gulp.src('widgets/**/*.scss')
        .pipe(sass({
          includePaths: [libraryBundleTmpDir]
        }))
        .pipe(concat('widgets.css'))
        .pipe(autoprefixer(config.autoprefixer))
        .pipe(gulp.dest(distDir))
        .on('end', callback)
    },
    function(callback){
      gulp.src('app/**/*.scss')
        .pipe(sass({
          includePaths: [libraryBundleTmpDir]
        }))
        .pipe(concat('app.css'))
        .pipe(autoprefixer(config.autoprefixer))
        .pipe(gulp.dest(distDir))
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
