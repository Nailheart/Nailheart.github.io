import gulp from 'gulp';
import autoprefixer from 'gulp-autoprefixer';
import cheerio from 'gulp-cheerio';
import concat from 'gulp-concat';
import csso from 'gulp-csso';
import htmlmin from 'gulp-htmlmin';
import imagemin, { mozjpeg, optipng, svgo } from 'gulp-imagemin';
import plumber from 'gulp-plumber';
import rename from 'gulp-rename';
import sourcemap from 'gulp-sourcemaps';
import svgmin from 'gulp-svgmin';
import sass from 'gulp-dart-sass';
import svgstore from 'gulp-svgstore';
import terser from 'gulp-terser';
import webp from 'gulp-webp';
import del from 'del';
import browserSync from 'browser-sync';

const { src, dest, series, parallel, watch } = gulp;

// Основные директории
const dirs = {
  src: 'src',
  dest: 'build'
};

// Пути к файлам
const path = {
  styles: {
    root: `${dirs.src}/scss/`,
    compile: `${dirs.src}/scss/style.scss`,
    save: `${dirs.dest}/css/`
  },
  html: {
    root: `${dirs.src}/*.html`,
    save: `${dirs.dest}`
  },
  scripts: {
    root: `${dirs.src}/js/*.js`,
    save: `${dirs.dest}/js/`
  },
  img: {
    root: `${dirs.src}/img/`,
    save: `${dirs.dest}/img/`
  }
};

// HTML
export const html = () => src(path.html.root)
  .pipe(htmlmin({
    removeComments: true,
    collapseWhitespace: true,
  }))
  .pipe(dest(path.html.save));

// Styles
export const styles = () => src(path.styles.compile)
  .pipe(plumber())
  .pipe(sourcemap.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer())
  .pipe(csso())
  .pipe(concat('style.css'))
  .pipe(rename({ suffix: '.min' }))
  .pipe(sourcemap.write('.'))
  .pipe(dest(path.styles.save));

// Scripts
export const scripts = () => src(path.scripts.root)
  .pipe(concat('main.js'))
  .pipe(terser())
  .pipe(rename({ suffix: '.min' }))
  .pipe(dest(path.scripts.save));

// Sprite
export const sprite = () => src(`${path.img.root}icons/*.svg`)
  .pipe(svgmin({
    plugins: [
      { removeViewBox: false }
    ]
  }))
  .pipe(cheerio({
    run: function ($) {
      $('[fill]').attr('fill', 'currentColor');
      $('[stroke]').attr('stroke', 'currentColor').attr('fill', 'transparent');
      $('[style]').removeAttr('style');
    },
    parserOptions: { xmlMode: true }
  }))
  .pipe(svgstore({ inlineSvg: true }))
  .pipe(rename('sprite.svg'))
  .pipe(dest(path.img.save));

// Imagemin
export const img = () => src(`${path.img.root}**/*`)
  .pipe(imagemin([
    mozjpeg({quality: 75, progressive: true}),
    optipng({optimizationLevel: 3})
    // svgo({
    //   plugins: [
    //     { removeViewBox: false },
    //     { cleanupIDs: true },
    //     { removeDimensions: true }
    //   ]
    // })
  ]))
  .pipe(dest(path.img.save))
  .pipe(webp({quality: 90}))
  .pipe(dest(path.img.save));

// Fonts
export const fonts = () => src(`${dirs.src}/fonts/**/*`)
  .pipe(dest(`${dirs.dest}/fonts/`));

// Clean
export const clean = () => del(dirs.dest);

// Server
export const devWatch = () => {
  browserSync.init({
    server: dirs.dest,
    notify: false,
    open: false,
  });
  watch(`${path.html.root}`, html).on('change', browserSync.reload);
  watch(`${path.styles.root}`, styles).on('change', browserSync.reload);
  watch(`${path.scripts.root}`, scripts).on('change', browserSync.reload);
};

// Develop
export const dev = series(clean, parallel(html, styles, scripts, sprite, img, fonts), devWatch);

// Build
export const build = series(clean, parallel(html, styles, scripts, sprite, img, fonts));
