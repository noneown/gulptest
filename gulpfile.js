/* = Gulp���
 -------------------------------------------------------------- */
// ����gulp
var gulp			= require('gulp');					// ������

// �������ǵ�gulp���
var sass 			= require('gulp-ruby-sass'),			// CSSԤ����/Sass����
    uglify 			= require('gulp-uglify'),				// JS�ļ�ѹ�� ����ѹ��
    imagemin 		= require('gulp-imagemin'),		// imagemin ͼƬѹ��
    pngquant 		= require('imagemin-pngquant'),	// imagemin ���ѹ�� png
    livereload 		= require('gulp-livereload'),			// ��ҳ�Զ�ˢ�£����������ƿͻ���ͬ��ˢ�£�
    webserver 		= require('gulp-webserver'),		// ���ط�����
    rename 		= require('gulp-rename'),			// �ļ�������
    sourcemaps 	= require('gulp-sourcemaps'),		// ��Դ��ͼ
    changed 		= require('gulp-changed'),			// ֻ�����й��޸ĵ��ļ�
    concat 			= require("gulp-concat"), 			// js�ļ��ϲ�
    clean 			= require('gulp-clean');				// �ļ�����
    autoprefixer 			= require('gulp-autoprefixer');				// ������css��ʽ�Զ���������ǰ׺
    minifycss 			= require('gulp-minify-css');				// css�ļ�ѹ��
    notify 			= require('gulp-notify');				// ǰ̨֪ͨ

/* = ȫ������
 -------------------------------------------------------------- */
var srcPath = {
    html	: 'src',
    css		: 'src/styles',
    script	: 'src/scripts',
    image	: 'src/images'
};
var destPath = {
    html	: 'dist',
    css		: 'dist/styles',
    script	: 'dist/scripts',
    image	: 'dist/images'
};

/* = ��������( Ddevelop Task )
 -------------------------------------------------------------- */
// HTML����
gulp.task('html', function() {
    return gulp.src( srcPath.html+'/**/*.html' )
        .pipe(changed( destPath.html ))
        .pipe(gulp.dest( destPath.html ));
});
// ��ʽ����
gulp.task('sass', function () {
    return sass( srcPath.css + '/*.scss', { style: 'compact', sourcemap: true }) // ָ��Դ�ļ�·�����������ļ�ƥ�䣨�����񣺼���ʽ��
        .on('error', function (err) {
            console.error('Error!', err.message); // ��ʾ������Ϣ
        })
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        //.pipe(rename({ suffix: '.min' }))
        //.pipe(minifycss())
        .pipe(sourcemaps.write())
        .pipe(sourcemaps.write('maps', {
            includeContent: false,
            sourceRoot: destPath.css
        })) // ��ͼ���·�������λ�ã�
        .pipe(gulp.dest(destPath.css)) // ���·�� destPath.css
        .pipe(livereload())
        .pipe(notify({ message: 'css task complete' }));
});
// JS�ļ�ѹ��&������
gulp.task('script', function() {
    return gulp.src( [srcPath.script+'/*.js','!'+srcPath.script+'/*.min.js'] ) // ָ��Դ�ļ�·�����������ļ�ƥ�䣬�ų� .min.js ��׺���ļ�
        .pipe(changed( destPath.script )) // ��Ӧƥ����ļ�
        .pipe(sourcemaps.init()) // ִ��sourcemaps
        //.pipe(rename({ suffix: '.min' })) // ������
        //.pipe(uglify({ preserveComments:'some' })) // ʹ��uglify����ѹ��������������ע��
        .pipe(sourcemaps.write('maps')) // ��ͼ���·�������λ�ã�
        .pipe(livereload())
        .pipe(gulp.dest(destPath.script)) // ���·��  destPath.script
        .pipe(notify({ message: 'js task complete' }));
});
// imagemin ͼƬѹ��
gulp.task('images', function(){
    return gulp.src( srcPath.image+'/**/*' ) // ָ��Դ�ļ�·��������ƥ��ָ����ʽ���ļ�������д�� .{png,jpg,gif,svg}
        .pipe(changed( destPath.image ))
        .pipe(imagemin({
            progressive: true, // ����ѹ��JPGͼƬ
            svgoPlugins: [{removeViewBox: false}], // ��Ҫ�Ƴ�svg��viewbox����
            use: [pngquant()] // ���ѹ��PNG
        }))
        .pipe(gulp.dest(destPath.image)); // ���·�� destPath.image
});
// �ļ��ϲ�
gulp.task('concat', function () {
    return gulp.src( srcPath.script+'/*.min.js' )  // Ҫ�ϲ����ļ�
        .pipe(concat('libs.js')) // �ϲ���libs.js
        .pipe(rename({ suffix: '.min' })) // ������
        .pipe(gulp.dest(destPath.script)); // ���·�� destPath.script
});
// ���ط�����
gulp.task('webserver', function() {
    gulp.src( destPath.html ) // ������Ŀ¼��.�����Ŀ¼��
        .pipe(webserver({ // ����gulp-webserver
            livereload: true, // ����LiveReload
            //directoryListing: true,
            port: 8888,
            open: true // ����������ʱ�Զ�����ҳ
        }));
});
// ��������
gulp.task('watch',function(){
    // ���� html
    gulp.watch( srcPath.html+'/**/*.html' , ['html'])
    // ���� scss
    gulp.watch( srcPath.css+'/*.scss' , ['sass']);
    // ���� images
    gulp.watch( srcPath.image+'/**/*' , ['images']);
    // ���� js
    gulp.watch( [srcPath.script+'/*.js','!'+srcPath.script+'/*.min.js'] , ['script']);
});
// Ĭ������
gulp.task('default',['webserver','watch']);

/* = ��������( Release Task )
 -------------------------------------------------------------- */
// �����ļ�
gulp.task('clean', function() {
    return gulp.src( [destPath.css+'/maps',destPath.script+'/maps'], {read: false} ) // ����maps�ļ�
        .pipe(clean());
});
// ��ʽ����
gulp.task('sassRelease', function () {
    return sass( srcPath.css + '/*.scss', { style: 'compressed' }) // ָ��Դ�ļ�·�����������ļ�ƥ�䣨������ѹ����
        .on('error', function (err) {
            console.error('Error!', err.message); // ��ʾ������Ϣ
        })
        .pipe(gulp.dest(destPath.css)); // ���·��
});
// �ű�ѹ��&������
gulp.task('scriptRelease', function() {
    return gulp.src( [srcPath.script+'/*.js','!'+srcPath.script+'/*.min.js'] ) // ָ��Դ�ļ�·�����������ļ�ƥ�䣬�ų� .min.js ��׺���ļ�
        .pipe(rename({ suffix: '.min' })) // ������
        .pipe(uglify({ preserveComments:'some' })) // ʹ��uglify����ѹ��������������ע��
        .pipe(gulp.dest( destPath.script )); // ���·��
});
// �������
gulp.task('release', ['clean'], function(){ // ��ʼ����ǰ����ִ��[clean]����
    return gulp.start('sassRelease','scriptRelease','images', 'html'); // ��[clean]����ִ����Ϻ���ִ����������
});

/* = ������ʾ( Help )
 -------------------------------------------------------------- */
gulp.task('help',function () {
    console.log('----------------- �������� -----------------');
    console.log('gulp default		����������Ĭ������');
    console.log('gulp html		HTML����');
    console.log('gulp sass		��ʽ����');
    console.log('gulp script		JS�ļ�ѹ��&������');
    console.log('gulp images		ͼƬѹ��');
    console.log('gulp concat		�ļ��ϲ�');
    console.log('---------------- �������� -----------------');
    console.log('gulp release		�������');
    console.log('gulp clean		�����ļ�');
    console.log('gulp sassRelease		��ʽ����');
    console.log('gulp scriptRelease	�ű�ѹ��&������');
    console.log('---------------------------------------------');
});