

//npm install gulp gulp-concat gulp-minify-css gulp-rev gulp-rev-collector gulp-cheerio --save-dev
//npm install gulp-cheerio --dev --save
//npm install gulp-htmlmin gulp-imagemin imagemin-pngcrush gulp-minify-css gulp-uglify gulp-concat gulp-rename gulp-notify --save-dev
var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'), //压缩图片
    cache = require('gulp-cache'),
    notify = require('gulp-notify'),
    rename = require('gulp-rename'),
    del = require('del');  
var rev = require('gulp-rev');                                  //- 对文件名加MD5后缀
var revCollector = require('gulp-rev-collector');               //- 路径替换
var cheerio = require('gulp-cheerio');
var cssver = require('gulp-make-css-url-version'); 					//加版本号


//js源文件路径
var jsSrc = ['js/jquery-1.9.0.min.js','js/customer.js'];
var cssSrc = ['css/style.css','css/customer.css'];

gulp.task('default',['minifyjs','minifycss','revCollector','images'],function() {
	    
});
gulp.task('mincss',function(){
	gulp.start('minifycss');
})
gulp.task('clean', function(cb) {
    del(['dist/'], cb)
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
gulp.task('minifycss',function(){
	return gulp.src(cssSrc)
		   .pipe(concat('main.css'))
		   .pipe(gulp.dest('dist/css'))
		   .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
	        .pipe(minifycss())    //压缩
	        .pipe(rev())        //给文件添加hash编码
	        .pipe(gulp.dest('dist/css'))  //输出
	        .pipe(rev.manifest())                       //生成rev-mainfest.json文件作为记录
	        .pipe(gulp.dest('dist/css'));  //输出
});
gulp.task('revCollector', ['minifyjs','minifycss'],function() {
    return gulp.src(['dist/**/*.json','index.html']) //读取 rev-manifest.json 文件以及需要进行文件名替换的文件
        .pipe(revCollector({
            replaceReved: true,
             dirReplacements: {
                'css/': '/css/',
                'js/': '/js/'
            }
        })) //执行文件内引用名的替换
        .pipe(gulp.dest('dist/')); //替换后的文件输出的目录
});
 // Images
 gulp.task('images', function() {
     return gulp.src('img/*')
         .pipe(cache(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
         })))
         .pipe(gulp.dest('dist/images'))
         .pipe(notify({
             message: 'Images task complete'
         }));
 });


