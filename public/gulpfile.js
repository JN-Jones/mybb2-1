"use strict";

let gulp = require("gulp"),
    changed = require("gulp-changed"),
    imagemin = require("gulp-imagemin"),
    concat = require("gulp-concat"),
    uglify = require("gulp-uglify"),
    stripDebug = require("gulp-strip-debug"),
    sass = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
    nano = require('gulp-cssnano'),
    rename = require("gulp-rename"),
    del = require("del"),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    browserify = require("browserify"),
    sourcemaps = require('gulp-sourcemaps');

var paths = {
    bower: "./bower_components",
    dist: "./assets",
    js: {
        src: "./js",
        dest: "./assets/js"
    },
    css: {
        src: "./css",
        dest: "./assets/css"
    },
    images: {
        src: "./images",
        dest: "./assets/images"
    },
    fonts: {
        src: "./fonts",
        dest: "./assets/fonts"
    }
};

var vendor_scripts = [
    paths.bower + "/jquery/dist/jquery.js",
    paths.bower + "/modernizr/modernizr.js",
    paths.bower + "/jquery-dropdown/jquery.dropdown.js",
    paths.bower + "/jquery-modal/jquery.modal.js",
    paths.bower + "/jquery-cookie/jquery.cookie.js",
    paths.bower + "/Stepper/jquery.fs.stepper.js",
    paths.bower + "/hideShowPassword/hideShowPassword.js",
    paths.bower + "/PowerTip/src/core.js",
    paths.bower + "/PowerTip/src/csscoordinates.js",
    paths.bower + "/PowerTip/src/displaycontroller.js",
    paths.bower + "/PowerTip/src/placementcalculator.js",
    paths.bower + "/PowerTip/src/tooltipcontroller.js",
    paths.bower + "/PowerTip/src/utility.js",
    paths.bower + "/dropit/dropit.js",
	paths.bower + "/dropzone/dist/dropzone.js",
	paths.bower + "/datetimepicker/jquery.datetimepicker.js",
    paths.bower + "/autosize/dist/autosize.js",
	paths.bower + "/jcrop/js/jquery.color.js",
	paths.bower + "/jcrop/js/jquery.Jcrop.js",
	paths.bower + "/lang-js/src/lang.js"
];

var scripts = [
	paths.js.src + "/cookie.js",
	paths.js.src + "/spinner.js",
	paths.js.src + "/modal.js",
	paths.js.src + "/post.js",
	paths.js.src + "/poll.js",
	paths.js.src + "/quote.js",
	paths.js.src + "/avatar.js",
    paths.js.src + "/other.js",
    paths.js.src + "/moderation.js"
];

var css = [
    paths.bower + "/normalize.css/normalize.css",
    paths.bower + "/fontawesome/scss/font-awesome.scss",
    paths.bower + "/dropit/dropit.css",
    paths.bower + "/jquery-dropdown/jquery.dropdown.css",
	paths.bower + "/datetimepicker/jquery.datetimepicker.css",
    paths.css.src + "/main.scss"
];

var admin_css = [
    paths.bower + "/normalize.css/normalize.css",
    paths.bower + "/fontawesome/scss/font-awesome.scss",
    paths.bower + "/dropit/dropit.css",
    paths.bower + "/jquery-dropdown/jquery.dropdown.css",
    paths.bower + "/datetimepicker/jquery.datetimepicker.css",
    paths.css.src + "/admin.scss"
];

gulp.task("default", ["images", "vendor_scripts", "scripts", "styles", "admin_styles", "rtl_styles", "admin_rtl_styles", "fonts"]);

gulp.task("clean", function(cb) {
    del(
        [
            paths.js.dest + "/**",
            paths.css.dest + "/**",
            paths.images.dest + "/**",
            paths.fonts.dest + "/**"
        ]
        , cb);
});

gulp.task("watch", ["default"], function() {
    gulp.watch("./bower_components/**/*.js", ["vendor_scripts"]);
    gulp.watch(paths.js.src + "/**/*.js", ["scripts"]);
    gulp.watch(paths.images.src + "/**/*", ["images"]);
    gulp.watch(paths.css.src + "/**/*.scss", ["styles"]);
    gulp.watch(paths.css.src + "/**/*.scss", ["rtl_styles"]);
    gulp.watch(paths.css.src + "/**/*.scss", ["admin_styles"]);
    gulp.watch(paths.css.src + "/**/*.scss", ["admin_rtl_styles"]);
    gulp.watch(paths.fonts.src + "/**/*", ["fonts"]);
});

gulp.task("images", function() {
    return gulp.src(paths.images.src + "/*")
        .pipe(changed(paths.images.dest))
        .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest(paths.images.dest));
});

gulp.task("vendor_scripts", function() {
    return gulp.src(vendor_scripts)
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(concat("vendor.js"))
        .pipe(gulp.dest(paths.js.dest + "/"))
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest(paths.js.dest + "/"));
});

gulp.task("scripts", function() {
	console.log(paths.js.dest);
    return gulp.src(scripts)
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(concat("main.js"))
        .pipe(gulp.dest(paths.js.dest + "/"))
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest(paths.js.dest + "/"));
});

gulp.task("styles", function() {
    return gulp.src(css)
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: [
                "./app/bower_components"
            ]
        }))
        .pipe(autoprefixer("last 2 version", "safari 5", "ie 8", "ie 9", "opera 12.1", "ios 6", "android 4"))
        .pipe(concat("main.css"))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.css.dest))
        .pipe(rename({suffix: ".min"}))
        .pipe(nano())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.css.dest));
});

gulp.task("admin_styles", function() {
    return gulp.src(admin_css)
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: [
                "./app/bower_components"
            ]
        }))
        .pipe(autoprefixer("last 2 version", "safari 5", "ie 8", "ie 9", "opera 12.1", "ios 6", "android 4"))
        .pipe(concat("admin.css"))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.css.dest))
        .pipe(rename({suffix: ".min"}))
        .pipe(nano())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.css.dest));
});

gulp.task("rtl_styles", function() {
    return gulp.src([paths.bower + "/normalize.css/normalize.css", paths.bower + "/fontawesome/scss/font-awesome.scss", paths.css.src + "/rtl.scss"])
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: [
                "./app/bower_components"
            ]
        }))
        .pipe(autoprefixer("last 2 version", "safari 5", "ie 8", "ie 9", "opera 12.1", "ios 6", "android 4"))
        .pipe(concat("rtl.css"))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.css.dest))
        .pipe(rename({suffix: ".min"}))
        .pipe(nano())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.css.dest));
});

gulp.task("admin_rtl_styles", function() {
    return gulp.src([paths.bower + "/normalize.css/normalize.css", paths.bower + "/fontawesome/scss/font-awesome.scss", paths.css.src + "/admin.rtl.scss"])
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: [
                "./app/bower_components"
            ]
        }))
        .pipe(autoprefixer("last 2 version", "safari 5", "ie 8", "ie 9", "opera 12.1", "ios 6", "android 4"))
        .pipe(concat("admin.rtl.css"))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.css.dest))
        .pipe(rename({suffix: ".min"}))
        .pipe(nano())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.css.dest));
});

gulp.task("fonts", function() {
    return gulp.src(paths.bower + "/fontawesome/fonts/**.*").pipe(gulp.dest(paths.fonts.dest));
});
