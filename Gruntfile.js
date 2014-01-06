'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    nodeunit: {
      files: ['test/**/*_test.js'],
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: ['lib/**/*.js']
      },      
      app: {
        src: ['web/js/app.js']
      },      
      test: {
        src: ['test/**/*.js']
      },
    },
    mustache: {
      files : {
        src: 'web/templates/',
        dest: 'web/js/templates.js',
        options: {
          prefix: '(function($){ window.templates =',
          postfix: '})(jQuery);',
          verbose: true
        }
      }
    },
    watch: {
      templates : {
        files : ['web/templates/*.mustache'],
        tasks : ['mustache']

      },
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib', 'nodeunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'nodeunit']
      },
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mustache');

  // Default task.
  grunt.registerTask('default', ['jshint', 'nodeunit','watch']);

};
