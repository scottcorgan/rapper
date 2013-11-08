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
      },
      angular: {
        files: {
          'dist/narrator.angular.js': ['lib/browser/narrator_angular.js'],
        },
        options: {
          ignore: ['promise', 'request'],
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
      },
      angular: {
        src: 'dist/narrator.angular.js',
        dest: 'dist/narrator.angular.min.js'
      },
    },
    
    watch: {
      build: {
        files: 'lib/**/*.js',
        tasks: ['build']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('build', ['browserify', 'uglify']);
  

};