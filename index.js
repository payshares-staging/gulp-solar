var gulp = module.parent.require('gulp');
var path = require('path');

var file = require('gulp-file');
var mergeStream = require('merge-stream');

// parseExtensions takes in a list of extensions and outputs an array of the
// relevant folders. This filters out extensions that don't have a relevant item (an extension that doesn't have styles)
//
// inputExtensions: array of extension names
// folder: string, either 'lib' or 'styles'
function parseExtensions(inputExtensions, folder) {
  var extensions = [];
  inputExtensions.forEach(function(extName) {
    var ext = require('../' + extName);
    if (typeof ext.lib === 'undefined') {
      return;
    }
    var extension = {
      name: extName,
      path: path.join(path.dirname(require.resolve(extName)), folder),
      folder: folder
    };
    extension.glob = path.join(extension.path, '/*');
    extensions.push(extension)
  });
  return extensions;
}
// sourceExtensions generates a stream of sources from an extensions struct (genearted by parseExtensions)
function sourceExtensions(extensions, folder) {
  var sources = [];
  extensions.forEach(function(ext) {
    sources.push(gulp.src(ext.glob, { base: 'node_modules' }));
  });
  return sources;
}

// item: 'packet' or 'bundle'
function kelpCompileCssFiles(inputExts, item) {
  var folder = '';
  var filename = ''; // _kelp-packet.scss or kelp-bundle.scss
  if (item === 'packet') {
    folder = 'lib';
    filename = '_kelp-packet.scss';
  } else if (item === 'bundle') {
    folder = 'styles';
    filename = 'kelp-bundle.scss';
  } else {
    // ERROR (this should never be reached since this is private)
    throw 'item must be "packet" or "bundle"'
  }

  var extensions = parseExtensions(inputExts, folder);
  var sources = sourceExtensions(extensions);

  var contents = '// THIS IS AN AUTOGENERATED KELP ' + item.toUpperCase() + '\n';
  extensions.forEach(function(ext) {
    contents += '@import "' + ext.name + '/' + folder + '/index";\n';
  });
  sources.push(file(filename, contents, { src: true }));
  return mergeStream(sources);
}

// takes in array of extension names, outputs a kelp packet (lib)
function kelpPacket(inputExts) {
  return kelpCompileCssFiles(inputExts, 'packet');
}
// takes in array of extension names, outputs an uncompiled kelp bundle (styles)
function kelpBundle(inputExts) {
  return kelpCompileCssFiles(inputExts, 'bundle');
}

module.exports = kelp = {
  packet: kelpPacket,
  bundle: kelpBundle,
};