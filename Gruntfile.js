module.exports = function (grunt) {
    'use strict';
    
    var isProd = grunt.option('prod') ? true : false;
    
    var trgt = isProd ? 'dst' : 'dev';
    
    // Project configuration
    grunt.initConfig({
        // Metadata
        pkg: grunt.file.readJSON('package.json'),
        src: 'src',
        trgt: trgt, // Use for <% template in JSON keys
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
          '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
          '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
          ' Licensed <%= pkg.license %> */\n',
        //// http://lodash.com/docs/#pluck
        //// ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        uniqueString: '<%= pkg.version %>',
        bowerFolder: 'bower_components',
        // Task configuration
        clean: {
            all: [trgt]
        },
        jshint: {
            gruntfile: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: 'Gruntfile.js'
            },
            app: {
                options: {
                    jshintrc: '<%= src %>' + '/js/.jshintrc'
                },
                // all js files in js folder
                src: ['<%= src %>/js/**/*.js']
            }
        },
        // js files concat and minify in Uglify
        // Concat other file types
        concat: {
            options: {
                separator: ';',
                banner: '<%= banner %>'
                //// process: function(src, filepath) {
                //// return '// Source: ' + filepath + '\n' +
                //// src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                //// },
                //// stripBanners: true
            },
            dst: {
                // // src: ['<%= src %>/js/menu/controllers.js', '<%= src %>/js/app.js'],
                // // dest: '<%= trgt %>/js/bundle-<%= uniqueString %>.js',
                // // nonull: true
            },
            dev: {}
        },
        // Only for prod mode
        uglify: {
            script_main: {
                options: {
                    // // banner: '<%= banner %>',
                    // sourceMap: '<%= trgt %>/js/bundle-<%= uniqueString %>.min.js.map',
                    // sourceMappingURL: 'bundle-<%= uniqueString %>.min.js.map',
                    // sourceMapPrefix: 2
                },
                files: {
                    '<%= trgt %>/js/bundle-<%= uniqueString %>.min.js': ['<%= trgt %>/js/menu/controllers.js', '<%= trgt %>/js/app.js']
                }
            },
            google_search_tool: {
                options: {
                    // sourceMap: '<%= trgt %>/js/google-search-tool.min.js.map',
                    // sourceMappingUrl: 'google-search-tool.min.js'
                },
                files: {
                    '<%= trgt %>/js/google-search-tool.min.js': '<%= trgt %>/js/google-search-tool.js'
                }
            }
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= src %>/',
                    dest: '<%= trgt %>/',
                    // Copy all files besides templates and scripts (which assembled separately)
                    src: ['**/*', '!tpl/**/*', '!js/**/*']
                }]
            },
            bower_js: {
                files: [{
                    expand: true,
                    dot: true,
                    flatten: true,
                    cwd: '<%= bowerFolder %>/',
                    dest: '<%= trgt %>/js/',
                    src: ['es5-shim/es5-shim.js', 'jquery/jquery.js']
                }]
            },
            bower_css: {
                files: [{
                    expand: true,
                    dot: true,
                    flatten: true,
                    cwd: '<%= bowerFolder %>/',
                    dest: '<%= trgt %>/css/',
                    src: []
                }]
            },
            bower_fonts: {
                files: [{
                    expand: true,
                    dot: true,
                    flatten: true,
                    cwd: '<%= bowerFolder %>/',
                    dest: '<%= trgt %>/fonts/',
                    src: []
                }]
            }
        },
        // Only for prod mode
        htmlmin: {
            index: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= trgt %>/',
                    src: '**/index.html',
                    dest: '<%= trgt %>/'
                }]
            }
        },
        less: {
            main: {
                options: {
                    yuicompress: true
                },
                files: {
                    '<%= trgt %>/css/site.min.css': '<%= trgt %>/css/site.less',
                    '<%= trgt %>/css/bootstrap.min.css': '<%= trgt %>/css/bootstrap.less'
                }
            }
        },
        assemble: {
            options: {
                engine: 'handlebars',
                data: '<%= src %>/tpl/data.json',
                conf: {
                    isProd: isProd
                }
            },
            html: {
                options: {
                    layout: 'src/tpl/layouts/default.hbs',
                    partials: ['src/tpl/partials/*.hbs']
                },
                files: [{
                    expand: true,
                    cwd: '<%= src %>/tpl/pages/',
                    src: '**/*.hbs',
                    dest: '<%= trgt %>'
                }]
            },
            // Assemble js files: replace {{}} to assemble data
            js: {
                options: {
                    ext: '.js'
                },
                files: [{
                    expand: true,
                    cwd: '<%= src %>/js/',
                    src: ['**/*.js'],
                    dest: '<%= trgt %>/js/'
                }]
            }
        },
        // Watch - only for dev mode
        watch: {
            jshint_gruntfile: {
                files: ['<%= jshint.gruntfile.src %>'],
                tasks: ['jshint:gruntfile']
            },
            jshint_app: {
                options: {
                    spawn: false
                },
                files: ['<%= src %>/js/**/*.js'],
                tasks: ['jshint:app']
            },
            copy_main: {
                options: {
                    cwd: '<%= src %>/',
                    spawn: false
                },
                files: ['**/*', '!tpl/**/*', '!js/**/*'],
                tasks: ['copy:main']
            },
            assemble_data: {
                files: ['<%= src %>/tpl/data/syst.json', 'package.json'],
                tasks: ['assemble:html', 'assemble:js']
            },
            assemble_html: {
                files: ['<%= src %>/tpl/**/*.hbs'],
                tasks: ['assemble:html']
            },
            assemble_js: {
                options: {
                    spawn: false
                },
                files: ['<%= src %>/js/**/*.js'],
                tasks: ['assemble:js']
            }
        },
        connect: {
            all: {
                options: {
                    open: true,
                    keepalive: true,
                    hostname: 'localhost',
                    port: 9001,
                    base: trgt
                }
            }
        },
        'gh-pages': {
            options: {
                base: '<%= trgt %>'
            },
            src: ['**']
        }
    });

    // grunt.event.on('watch', function(action, filepath, trgt) {
    // grunt.log.writeln(trgt + ': ' + filepath + ' has ' + action);
    // });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-less');
    //// grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('assemble');
    // for dev
    grunt.loadNpmTasks('grunt-contrib-connect');
    // for dst
    grunt.loadNpmTasks('grunt-gh-pages');

    var tasks = ['jshint',
     'clean:all',
     'copy:main',
     'copy:bower_js',
     'copy:bower_css',
     'copy:bower_fonts',
     'assemble:js',
     'assemble:html',
     'less:main'];
    
    if (isProd){
        var prodTasks = [
            'uglify:script_main',
            'uglify:google_search_tool',
            'htmlmin:index'
        ];
        
        // Make one array for default task
        tasks = tasks.concat(prodTasks);
    }
    
    // Default task
    grunt.registerTask('default', tasks);
};