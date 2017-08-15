

//npm install gulp gulp-concat gulp-minify-css gulp-rev gulp-rev-collector gulp-cheerio --save-dev
//npm install gulp-cheerio --dev --save

var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    del = require('del');  
var rev = require('gulp-rev');                                  //- 对文件名加MD5后缀
var revCollector = require('gulp-rev-collector');               //- 路径替换
var cheerio = require('gulp-cheerio');
var cssver = require('gulp-make-css-url-version'); 					//加版本号


//js源文件路径
var jsSrc = ['js/jquery-1.9.0.min.js','js/customer.js'];


gulp.task('default', function() {
    gulp.start('clean','minifyjs','revCollector');
});

gulp.task('clean', function(cb) {
    del(['minified/css', 'minified/js','rev/js','dist/'], cb)
});

gulp.task('minifyjs', function() {//ok
    return gulp.src(jsSrc)
        .pipe(concat('main.js'))    //合并所有js到main.js
        .pipe(gulp.dest('dist/js'))    //输出main.js到文件夹
        
        .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
        .pipe(uglify())    //压缩
        .pipe(rev())        //给文件添加hash编码
        .pipe(gulp.dest('dist/js'))  //输出
        .pipe(rev.manifest())                       //生成rev-mainfest.json文件作为记录
        .pipe(gulp.dest('dist/js'));  //输出
});
gulp.task('revCollector', function() {
    return gulp.src(['dist/js/*.json','index.html']) //读取 rev-manifest.json 文件以及需要进行文件名替换的文件
        .pipe(revCollector({
            replaceReved: true
        })) //执行文件内引用名的替换
        .pipe(gulp.dest('dist/')); //替换后的文件输出的目录
});




//js生成文件hash编码并生成 rev-manifest.json文件名对照映射  
gulp.task('revJs', function(){  //---waite del
    return gulp.src(jsSrc)  
        .pipe(concat('main.js'))    //合并所有js到main.js
        .pipe(gulp.dest('rev/js')) 
        .pipe(rev())        //给文件添加hash编码
        .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
        .pipe(uglify())    //压缩
        .pipe(gulp.dest('rev/js'))//压缩后保存路径
        .pipe(rev.manifest())                       //生成rev-mainfest.json文件作为记录  
        .pipe(gulp.dest('rev/js'));  //json生产路径
});  




