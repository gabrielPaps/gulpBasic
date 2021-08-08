// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ====================================== MÓDULOS REQUERIDOS ====================================
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Cambios de nombre
const rename = require('gulp-rename');
// Minificado de Javascript
const uglify = require('gulp-uglify');
// Filtro para compilar sólo lo cambiado
const changed = require('gulp-changed');
// Sincronización con browser
const browserSync = require('browser-sync');
// Sass
const gulpSass = require('gulp-dart-sass');
// Tratado de imagenes
const image = require('gulp-image');

//++++++++++++++++++++++++++++++++++++++++++
//============ Funciones de GULP ===========
//++++++++++++++++++++++++++++++++++++++++++

const {
  //Resuelve el PATH de entrada
  src,
  //Resuelve el PATH de salida
  dest,
  //Ejecuta 2 tareas de manera Asíncrona
  series,
  //Ejecuta 2 tareas de manera Síncrona
  parallel,
  //Observa los cambios
  watch
} = require('gulp');

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ========================================== INICIO DE TAREAS =======================================
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//+++++++++++++++++++++++++++
//====== COMPILADORES =======
//+++++++++++++++++++++++++++

//Compilación del HTML
function html() {
    //Ruta del archivo a compilar
    const source = './src/views/*.html';
  
    return src(source)
        // Control de archivos modificados
        .pipe(changed(source))
        // Carpeta de destino
        .pipe(dest('./dist/'))
}

//Compilación de SASS
function sass(){
    const source = './src/sass/main.scss';

    return src(source)
        .pipe(gulpSass().on('error', gulpSass.logError))
        .pipe(dest('./dist/css'));
}

//Compilación del JAVASCRIPT
function js() {
  //Ruta de origen
  const source = './src/js/*.js';

  return src(source)
      // Control de archivos modificados
      .pipe(changed(source))
      //Cambio de nombre
      .pipe(rename({
          extname: '.min.js'
      }))
      // Minificado
      .pipe(uglify())
      // Ruta de destino
      .pipe(dest('./dist/js/'))
}

//Compilación de imagenes
function images(){
  //Ruta de origen
  const source = './src/images/*.*'

  return src(source)
    .pipe(image())
    //Ruta de destino
    .pipe(dest('./dist/images'))
}

//Sincronización con el browser
function browserSinc(){
  browserSync.init(null, {
    files: ['./dist/*.*'],
    port: 3000
  });
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ====================================== Observadores ================================================
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//Compilación al cambiar Sass
function observarSass(){
  watch('./src/sass/**/*.scss')
}

//Compilación al cambiar Javascript
function observarJS(){
  watch('./src/js/*.js', js)
}

//Compilación al cambiar Html
function observarHtml(){
  watch('./src/views/*.html', html)
}

//Compilación al cambiar imagenes
function observarImages(){
  watch('./src/images/*.*', images)
}

//***Observador de observadores***
function bigBrother(){
  parallel(observarJS, observarImages, observarHtml, observarSass)
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ==================================== Exportacion de tareas ==========================================
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++ COMPILADORES +++
//Compilación Html
exports.html = html;
//Compilación Sass
exports.sass = sass;
//Compilación JavaScript
exports.js = js;
//Compilación de Imagenes
exports.images = images;

// ++++ OBSERVADORES ++++
//Compila JS cada vez que se guarda
exports.observarJS = observarJS;
//Compila SASS cada vez que se guarda
exports.observarSass = observarSass;
//Recarga a los cambios de Html
exports.observarHtml = observarHtml;
//Recarga a los cambios de Images
exports.observarImages = observarImages;
//Todos los observadores juntos
exports.bigBrother = bigBrother;

// ++++ Tarea por defecto (Usada para el HRM) ++++
//Sincronización con Browser || HRM
exports.default = parallel(observarJS, observarHtml);


exports.browserSinc = browserSinc;

// ++++ Tarea de optimización general ++++
//Envia a productivo
exports.build = parallel( js);