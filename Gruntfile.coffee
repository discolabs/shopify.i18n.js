module.exports = (grunt) ->

  # Initialise the Grunt config.
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    # Meta information about shopify.i18n.js
    meta:
      banner:
        '// shopify.i18n.js\n' +
        '// version: <%= pkg.version %>\n' +
        '// author: <%= pkg.author %>\n' +
        '// license: <%= pkg.licenses[0].type %>\n'

    concat:
      options:
        separator: ';'
      build:
        src: ['src/jquery.currencies.js', 'src/shopify.i18n.js']
        dest: 'dist/shopify.i18n.js'

    uglify:
      build:
        files:
          'dist/shopify.i18n.min.js': 'dist/shopify.i18n.js'

    # Watch task.
    watch:
      concat:
        files: ['src/*.js']
        tasks: ['concat']
      uglify:
        files: ['dist/shopify.i18n.js']
        tasks: ['uglify']

  # Load tasks made available through NPM.
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  # Register tasks made available through the Gruntfile.
  grunt.registerTask 'build', ['concat', 'uglify']
  grunt.registerTask 'default', ['build', 'watch']
