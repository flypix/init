module.exports = function (grunt) {

	'use strict';

	// Project configuration.
	grunt.initConfig({
		pkg: require('./package'),
		meta: {
			banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %> */'
		},

		jshint: {
			all: [
				'Gruntfile.js',
				'js/**/*.js'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		// Build modernizr
		modernizr: {
			devFile: 'components/modernizr/modernizr.js',
			outputFile : 'dist/<%= pkg.version %>/modernizr.min.js',

			extra: {
				shiv: true,
				mq: true
			},

			// Minify
			uglify: true,

			// Files
			files: ['js/**/*.js', 'scss/**/*.scss']
		},

		sass: {
			dev: {
				options: {
					unixNewlines: true,
					style: 'expanded'
				},
				files: {
					'css/main.css': 'scss/main.scss'
				}
			},
			deploy: {
				options: {
					style: 'compressed'
				},
				files: {
					'dist/<%= pkg.version %>/main.min.css': 'scss/main.scss'
				}

			}
		},

		clean: {
			deploy: ['dist']
		},

		requirejs: {
			compile: {
				options: {
					mainConfigFile: 'js/config.js',
					include: ['../components/requirejs/require'],
					out: 'dist/<%= pkg.version %>/main.min.js'
				}
			}
		},

		copy: {
			deploy: {
				files: [{
					src: ['js/**'],
					dest: 'dist/'
				}]
			}
		},

		// Lossless image optimization
		imagemin: {
			images: {
				options: {
					optimizationLevel: 5
				},
				files: [{
					expand: true,
					cwd: 'img/',
					src: ['**/*.{png,jpg,gif}'],
					dest: 'dist/img/'
				}]
			}
		},

		// Server config
		connect: {
			test: {
				port: 8000
			},

			server: {
				options: {
					port: 9001,
					keepalive: true
				}
			}
		},

		// Jasmine test configuration
		jasmine: {
			src: 'js/**/*.js',
			options: {
				host: 'http://127.0.0.1:8000/',
				specs: 'tests/*.js',
				template: require('grunt-template-jasmine-requirejs'),
				templateOptions: {
					requireConfigFile: 'js/config.js',
				}
			}
		},

		watch: {
			scss: {
				files: ['scss/**/*.scss'],
				tasks: 'sass:dev'
			},

			js: {
				files: [
					'Gruntfile.js',
					'js/**/*.js'
				],
				tasks: ['jshint', 'jasmine']
			}
		},

		// Setup concurrent tasks
		concurrent: {
			deploy1: ['jshint', 'clean', 'modernizr', 'sass:deploy', 'imagemin', 'copy'],
			deploy2: ['requirejs', 'connect:test', 'jasmine'],
			dev1: ['jshint', 'connect:test', 'jasmine', 'sass:dev', 'copy'],
			dev2: ['requirejs']
		}
	});

	// Load some stuff
	grunt.loadNpmTasks('grunt-modernizr');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-contrib-jasmine');

	// A task for development
	grunt.registerTask('dev', ['concurrent:dev1', 'concurrent:dev2']);

	// A task for deployment
	grunt.registerTask('deploy', ['concurrent:deploy1', 'concurrent:deploy2']);

	// Default task
	grunt.registerTask('default', ['dev']);

	// Travis CI task
	grunt.registerTask('travis', ['jshint', 'connect:test', 'jasmine']);

};
