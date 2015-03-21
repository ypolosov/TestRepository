module.exports = function (grunt) {

    var debug = !grunt.option('prod');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            dts: ["app/**/*.d.ts", "!app/_all.d.ts"],
            js: ["app/**/*.js"],
            css: ["app/**/*.css", "!app/css/**/*.css"],
        },

        tsd: {
            refresh: {
                options: {
                    // execute a command 
                    command: 'reinstall',

                    //optional: always get from HEAD 
                    latest: true,

                    // optional: specify config file 
                    config: 'tsd.json',

                    // experimental: options to pass to tsd.API 
                    opts: {
                        // props from tsd.Options 
                    }
                }
            }
        },

        ts: {
            default: {
                options: {
                    sourceMap: false,
                    module: 'amd'
                },
                src: ["/SVNS/app/js/trackia/prototype/typescript-angular/app/app.ts"],
                //outDir: 'out',
                //out: 'app/app.js',
                verbose: true
            }
        },

        copy: {
            main: {
                files: [
                    // js
                    {
                        nonull: true,
                        src: 'node_modules/grunt-contrib-requirejs/node_modules/requirejs/require.js',
                        dest: 'app/libs/requirejs/require.js'
                    },
                    {
                        nonull: true,
                        src: 'node_modules/angular/angular.js',
                        dest: 'app/libs/angularjs/angular.js'
                    },
                    {
                        nonull: true,
                        src: 'node_modules/angular-ui-router/release/angular-ui-router.js',
                        dest: 'app/libs/angular-ui-router/angular-ui-router.js'
                    },
                    {
                        nonull: true,
                        src: 'node_modules/angular-bootstrap/dist/ui-bootstrap.js',
                        dest: 'app/libs/angular-ui-bootstrap/angular-ui-bootstrap.js'
                    },
                    // css
                    {
                        nonull: true,
                        src: 'node_modules/todomvc-common/base.css',
                        dest: 'app/css/todomvc-common/base.css'
                    },
                    {
                        nonull: true,
                        src: 'node_modules/todomvc-app-css/index.css',
                        dest: 'app/css/todomvc-app-css/index.css'
                    },
                    {
                        nonull: true,
                        src: 'node_modules/leaflet/dist/leaflet.css',
                        dest: 'app/css/leaflet/leaflet.css'
                    },
                    // images
                    {
                        nonull: true,
                        expand: true,
                        cwd: 'node_modules/leaflet/dist/images',
                        src: [
                          '*.png'
                        ],
                        dest: 'app/css/leaflet/images',
                    },
                ]
            },
        },

        compass: {                  // Task
            dist: {                   // Target
                options: {              // Target options
                    config: 'app/css/bootstrap-customized/config.rb', // important! put any options after 'config' to override its options
                    basePath: 'app/css/bootstrap-customized',
                    force: true
                }
            }
        },

        requirejs: {
            compile: {
                options: {
                    baseUrl: "/SVNS",
                    paths: {
                        "angular": "app/js/trackia/prototype/typescript-angular/app/libs/angularjs/angular",
                        "angularUiRouter": "app/js/trackia/prototype/typescript-angular/app/libs/angular-ui-router/angular-ui-router",
                        "angularUiBootstrap": "app/js/trackia/prototype/typescript-angular/app/libs/angular-ui-bootstrap/angular-ui-bootstrap",
                    },
                    shim: {
                        "angular": {
                            exports: "angular"
                        },
                        'angularUiRouter': {
                            deps: ['angular']
                        },
                        'angularUiBootstrap': {
                            deps: ['angular']
                        }
                    },
                    include: [
                        "angularUiRouter",
                        'angularUiBootstrap'
                    ],
                    name: 'app/js/trackia/prototype/typescript-angular/app/app',
                    out: 'app/app.js',
                    insertRequire: ['app/js/trackia/prototype/typescript-angular/app/app'],
                    optimize: 'none',
                }
            }
        },

        'http-server': {
            default: {
                port: 8282,
            }
        },

        watch: {
            ts: {
                // We watch and compile sass files as normal but don't live reload here
                files: ['app/**/*.ts'],
                tasks: ['ts', 'requirejs'],
            },
            compass: {
                // We watch and compile sass files as normal but don't live reload here
                files: ['app/css/**/*.scss', 'app/css/**/*.css', '!app/css/bootstrap-customized/css/styles.css'],
                tasks: ['compass'],
            },
        },
    });


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //cleaner
    grunt.loadNpmTasks('grunt-contrib-clean');

    //TypeScript Definition manager for DefinitelyTyped
    grunt.loadNpmTasks('grunt-tsd');

    //Typescript compiler
    grunt.loadNpmTasks("grunt-ts");

    //Copy files and folders
    grunt.loadNpmTasks('grunt-contrib-copy');

    //Compile Compass to CSS
    grunt.loadNpmTasks('grunt-contrib-compass');

    //Optimize RequireJS projects using r.js
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    //http-server
    grunt.loadNpmTasks('grunt-http-server');

    //Run tasks whenever watched files change
    grunt.loadNpmTasks('grunt-contrib-watch');


    //////////////////////////////////////////////////////////////////////////////////////////////////////////


    grunt.registerTask("cln", ['clean']);

    grunt.registerTask("init", ['clean', 'copy', 'tsd']);

    grunt.registerTask("dts", ['tsd']);

    grunt.registerTask("ws", ["http-server"]);

    grunt.registerTask("css", ["compass"]);

    grunt.registerTask("compile", ['ts', /*'compass',*/ 'requirejs']);

    grunt.registerTask("wtch", ['watch']);

    grunt.registerTask("default", ['clean', 'copy', 'tsd', 'ts', 'compass', 'requirejs']);

};