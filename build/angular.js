#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var browserify = require('browserify');
var ngmin = require('ngmin');
var minify = require('minify');

var ENTRY_FILE = path.resolve(__dirname, '../lib/browser/angular.js');
var DIST_FILE = path.resolve(__dirname, '../dist/rapper.angular.js');
var DIST_FILE_MIN = path.resolve(__dirname, '../dist/rapper.angular.min.js');

browserify(ENTRY_FILE)
  .ignore('httpify')
  .ignore('promise')
  .bundle()
  .pipe(fs.createWriteStream(DIST_FILE)).on('close', optimize);

function optimize () {
  var contents = fs.readFileSync(DIST_FILE, 'utf8');
  contents = ngmin.annotate(contents);
  
  fs.writeFileSync(DIST_FILE_MIN, contents);
  
  minify.optimize(DIST_FILE_MIN, {
    callback: function (minifiedContents) {
      fs.writeFileSync(DIST_FILE_MIN, minifiedContents);
    }
  });
}
