# [gulp](https://github.com/gulpjs/gulp)-[kelp](https://github.com/stellar/kelp)

> A gulp plugin to build the [kelp framework](https://github.com/stellar/kelp)

This plugin builds the kelp framework css and js. It follows the build process laid out in the [kelp build overview](https://github.com/stellar/kelp/blob/master/docs/kelp-overview.md). It uses the kelp

## Install
Install with [npm](https://www.npmjs.com/package/gulp-kelp)

```sh
npm install --save-dev gulp-kelp
```

## Example usage
First, make sure that you have installed and added to your package.json `kelp` and the kelp extensions you want to use.

```js
var gulp = require('gulp');
var kelp = require('gulp-kelp');

gulp.task('styles', function() {
  return gulp.src(['app/**/*.scss', 'widgets/**/*.scss'])
    .pipe(kelp.css({
      extensions: ['kelp-theme-base', 'kelp-theme-sdf'], // order insensitive
      tmpDir: '.tmp/kelp' // default, optional
    }))
    .pipe(gulp.dest('./dist/css'))
});

gulp.task('js', function() {
  return gulp.src('your/other/**/*.js', )
    .pipe(gulp.dest('./dist/js'))
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

1. Copy the files to the

## Warnings:
Do not run m
