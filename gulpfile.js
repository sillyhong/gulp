//引入gulp插件
var gulp = require('gulp'),
	//转换less文件
	less = require('gulp-less'),
	//压缩css
	cssmin = require('gulp-cssmin'),
	//添加css私有前缀
	autoprefixer = require('gulp-autoprefixer'),
	//添加版本号
	rev = require('gulp-rev'),
	//压缩图片
	imagemin = require('gulp-imagemin'),
	//合并文件，修改路径
	useref = require('gulp-useref'),
    //判断
	gulpif = require('gulp-if'),
	//压缩js
	uglify = require('gulp-uglify'),
	//重命名
	rename = require('gulp-rename'),
	//替换内容
	revCollector = require('gulp-rev-collector');

// gulp 对象，提供了若干方法

// 处理css
gulp.task('css', function () {
	//依赖 执行时异步的  需要return 强制执行 同步
	return gulp.src('./public/less/main.less')
		.pipe(less())
		.pipe(cssmin())
		.pipe(autoprefixer())
		.pipe(rev())
		.pipe(gulp.dest('./release/public/css'))
		.pipe(rev.manifest())
		.pipe(rename('css-manifest.json'))
		.pipe(gulp.dest('./release/rev'))


});

// 处理图片
gulp.task('image', function () {

	return gulp.src(['./public/images/**/*', './uploads/*'], {base: './'})
		.pipe(imagemin())
		.pipe(rev())
		.pipe(gulp.dest('./release'))
		.pipe(rev.manifest())
		.pipe(rename('image-manifest.json'))
		.pipe(gulp.dest('./release/rev'));

});

// 处理js
gulp.task('useref', function () {

	return gulp.src('./index.html')
		.pipe(useref())
		.pipe(gulpif('*.js', uglify()))
		.pipe(gulpif('*.js', rev()))
		.pipe(gulp.dest('./release'))
		.pipe(rev.manifest())
		.pipe(rename('js-manifest.json'))
		.pipe(gulp.dest('./release/rev'));

});

// 其它
gulp.task('other', function () {

	return gulp.src(['./api/*', './public/fonts/*', './public/libs/*', './views/*.html'], {base: './'})
		.pipe(gulp.dest('./release'));

});

// 替换
gulp.task('rev', ['css', 'image', 'useref'], function () {
	//单页面应用
	gulp.src(['./release/rev/*.json', './release/index.html'])
		.pipe(revCollector())
		.pipe(gulp.dest('./release'));

});

gulp.task('default', ['rev', 'other']);

// gulp.task('default', function () {
// 	console.log('默认');
// })

// gulp.task('demo', ['css', 'image'], function () {
// 	console.log(11);
// });