module.exports = function(grunt) {
	grunt.initConfig({
		sass: {
			files: {
				src: 'assets/sass/main.sass',
				dest: 'public/css/main.css'
			}
		},
		autoprefixer: {
			files: {
				src: 'public/css/main.css', dest: 'public/css/main.css'
			}
		},
		copy: {
			files: {
				cwd: 'assets/js',
				src: ['**'], dest: 'public/js',
				expand: true, filter: 'isFile'
			}
		},
		watch: {
			// compile sass files
			sass: {
				files: ['assets/sass/**/*.sass'],
				tasks: ['sass', 'autoprefixer']
			},
			// just copy js from assets to public
			js: {
				files: ['assets/js/**/*.js'],
				tasks: ['copy'],
				options: { livereload: true }
			},
			// changes in views, data and css (after sass and autoprefixer)
			views: {
				files: ['views/**/*', 'data/**/*', 'public/css/**/*.css'],
				options: { livereload: true }
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-autoprefixer');
	
	grunt.registerTask('server', function() {
		require('./app.js').listen(3000);
		grunt.log.writeln('Server started on port 3000');
	});
	
	grunt.registerTask('default', ['sass', 'autoprefixer', 'copy', 'server', 'watch']);
};