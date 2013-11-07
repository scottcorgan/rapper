module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    browserify: {
      commonjs: {
        files: {
          'dist/narrator.js': ['lib/narrator.js'],
        },
      },
      standalone: {
        files: {
          'dist/narrator.standalone.js': ['lib/narrator.js'],
        },
        options: {
          standalone: 'Narrator'
        }
      }
    },
    
    uglify: {
      commonjs: {
        src: 'dist/narrator.js',
        dest: 'dist/narrator.min.js'
      },
      standalone: {
        src: 'dist/narrator.standalone.js',
        dest: 'dist/narrator.standalone.min.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('build', ['browserify', 'uglify']);
  

};