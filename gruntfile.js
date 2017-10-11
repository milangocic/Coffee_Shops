module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        sass:{
            options:{
                sourcemap: 'none'
            },
            t1:{
                files:{
                    'libs/css/style.css':'libs/sass/style.scss'
                }
            }
        },
        uglify:{
            options:{
                sourceMap: true
            },
            t1:{
                files:{
                    'libs/js/app.min.js':'libs/js/app.js'
                }
            }
        },
        watch:{
            sass:{
                files: 'libs/sass/style.scss',
                tasks:['sass:t1']
            },
            js:{
                files: 'libs/js/app.js',
                tasks: ['uglify']
            }
        }
    });

    grunt.registerTask('default',['watch']);

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
}