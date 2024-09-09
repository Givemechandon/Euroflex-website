'use strict'; /* jshint ignore:line */

var gulp = require('gulp')
  , path = require('path')
  , fs = require('fs')
  , autoprefixer = require('gulp-autoprefixer')
  , del = require('del')
  , pkg = JSON.parse(fs.readFileSync('package.json'))
  , version = parseInt(pkg.version)
  , store = pkg.store
  , acronym = pkg.acronym
  , env = pkg.environment
  , runSequence = require('run-sequence')
  , $ = require('gulp-load-plugins')() /* jshint ignore:line */

  /**
   * 3rd party vtex connect
   */
  , httpPlease = require('connect-http-please')
  , serveStatic = require('serve-static')
  , proxy = require('proxy-middleware')
  , url = require('url');
   // , middlewares = require('./middlewares');

   var _rewriteLocation = function _rewriteLocation(location, environment) {
     return location.replace('https:', 'http:').replace(new RegExp("(".concat(environment, ")(.+?)(/arquivos/)"), 'g'), 'vtexlocal$2$3');
   };

   var _rewriteReferer = function _rewriteReferer(referer, environment, protocol) {
     if (protocol === 'https') {
       referer = referer.replace('http:', 'https:');
     }

     return referer.replace(new RegExp("(".concat(environment, ")(.+?)(/arquivos/)"), 'g'), 'vtexlocal$2$3');
   };

   var disableCompression = function disableCompression(req, res, next) {
     req.headers['accept-encoding'] = 'identity';
     next();
   };

   var rewriteLocationHeader = function rewriteLocationHeader(environment) {
     return function (req, res, next) {
       var writeHead = res.writeHead;

       res.writeHead = function (statusCode, headers) {
         if (headers && headers.location) {
           headers.location = _rewriteLocation(headers.location, environment);
         }

         res.writeHead = writeHead;
         res.writeHead(statusCode, headers);
       };

       next();
     };
   };

   var replaceHost = function replaceHost(host) {
     return function (req, res, next) {
       req.headers.host = host;
       next();
     };
   };

   var replaceReferer = function replaceReferer(environment, protocol, host) {
     return function (req, res, next) {
       var referer = host;

       if (typeof req.headers.referer !== 'undefined') {
         referer = _rewriteReferer(req.headers.referer, environment, protocol);
       }

       req.headers.referer = referer;
       next();
     };
   };

   var replaceHtmlBody = function replaceHtmlBody(environment, protocol) {
     return function (req, res, next) {
       var ignoreReplace = [/\.js(\?.*)?$/, /\.css(\?.*)?$/, /\.svg(\?.*)?$/, /\.ico(\?.*)?$/, /\.woff(\?.*)?$/, /\.png(\?.*)?$/, /\.jpg(\?.*)?$/, /\.jpeg(\?.*)?$/, /\.gif(\?.*)?$/, /\.pdf(\?.*)?$/];
       var ignore = ignoreReplace.some(function (ignore) {
         return ignore.test(req.url);
       });

       if (ignore) {
         return next();
       }

       var data = '';
       var write = res.write;
       var end = res.end;
       var writeHead = res.writeHead;
       var proxiedStatusCode = null;
       var proxiedHeaders = null;

       res.writeHead = function (statusCode, headers) {
         proxiedStatusCode = statusCode;
         proxiedHeaders = headers;
       };

       res.write = function (chunk) {
         return data += chunk;
       };

       res.end = function (chunk, encoding) {
         if (chunk) {
           data += chunk;
         }

         if (data) {
           if (protocol === 'https') {
             data = data.replace(new RegExp('(https)(.+?)(.vtex)', 'g'), "http$2$3");
           }

           data = data.replace(new RegExp('vteximg', 'g'), 'vtexlocal');
           data = data.replace(new RegExp("(".concat(environment, ")(.+?)(/arquivos/)"), 'g'), 'vtexlocal$2$3');
         } // Restore res properties


         res.write = write;
         res.end = end;
         res.writeHead = writeHead;

         if (proxiedStatusCode && proxiedHeaders) {
           proxiedHeaders['content-length'] = Buffer.byteLength(data);

           if (protocol === 'https') {
             delete proxiedHeaders['content-security-policy'];
           }

           res.writeHead(proxiedStatusCode, proxiedHeaders);
         }

         res.end(data, encoding);
       };

       next();
     };
   };

   var errorHandler = function errorHandler(err) {
     console.log("".concat(err, " >>> ").concat(req.url));
   };

   var _middlewares = {
     disableCompression: disableCompression,
     rewriteLocationHeader: rewriteLocationHeader,
     replaceHost: replaceHost,
     replaceReferer: replaceReferer,
     replaceHtmlBody: replaceHtmlBody,
     errorHandler: errorHandler
   };


//                   __ _
//   ___ ___  _ __  / _(_) __ _
//  / __/ _ \| '_ \| |_| |/ _` |
// | (_| (_) | | | |  _| | (_| |
//  \___\___/|_| |_|_| |_|\__, |
//                        |___/

const {
  vtex
} = JSON.parse(fs.readFileSync('package.json'))


const accountName = vtex.store
const environment = vtex.environment
const portalHost = `${accountName}.${environment}.com.br`
const imgProxyOptions = url.parse(`${vtex.protocol}://${accountName}.vteximg.com.br/arquivos`)
const portalProxyOptions = url.parse(`${vtex.protocol}://${portalHost}/`)

imgProxyOptions.route = '/arquivos'
portalProxyOptions.preserveHost = true
portalProxyOptions.cookieRewrite = `${accountName}.vtexlocal.com.br`


//                                  _
//   ___ ___  _ __  _ __   ___  ___| |_
//  / __/ _ \| '_ \| '_ \ / _ \/ __| __|
// | (_| (_) | | | | | | |  __/ (__| |_
//  \___\___/|_| |_|_| |_|\___|\___|\__|

gulp.task('connect', function () {
  $.connect.server({
    hostname: '*',
    port: 3031,
    debug: false,
    middleware: () => {
      return [
        _middlewares.disableCompression,
        _middlewares.rewriteLocationHeader(environment),
        _middlewares.replaceHost(portalHost),
        _middlewares.replaceReferer(environment, 'https', portalHost),
        _middlewares.replaceHtmlBody(environment, 'https'),
        httpPlease({
          host: portalHost,
          verbose: true
        }),
        serveStatic('./build'),
        proxy(imgProxyOptions),
        proxy(portalProxyOptions),
        _middlewares.errorHandler
      ]
    },
    livereload: true
  });

  var openOptions = {
    uri: 'http://'+ store +'.vtexlocal.com.br/',
    //app: 'chrome.exe'
  };

  return gulp.src('./')
    .pipe($.open(openOptions));
});


//       _
//   ___| | ___  __ _ _ __
//  / __| |/ _ \/ _` | '_ \
// | (__| |  __/ (_| | | | |
//  \___|_|\___|\__,_|_| |_|

gulp.task('clean', function () {
  return del(['build/', 'deploy/']);
});

gulp.task('message', async function() {
  return console.log("HTTP Server Started");
});

//    _                                _       _
//   (_) __ ___   ____ _ ___  ___ _ __(_)_ __ | |_
//   | |/ _` \ \ / / _` / __|/ __| '__| | '_ \| __|
//   | | (_| |\ V / (_| \__ \ (__| |  | | |_) | |_
//  _/ |\__,_| \_/ \__,_|___/\___|_|  |_| .__/ \__|
// |__/                                 |_|

gulp.task('js:main', function (done) {
  var devices = ['web', 'mob'];

  devices.map(function (device) {
    for (var i = 0; i <= version; i++) {
      /**
       * TODO:
       * HÃ¡ um erro em [device] ao incrementar a versÃ£o no package.json
       */
      var vendor = JSON.parse(fs.readFileSync('vendor.json'))
        , files = vendor.versions[i][device]
        , mainFiles = [
            'assets/js/components/*.js'
          , 'assets/js/controllers/*.js'
        ];

      if (!files) {
        files = [];
      }

      Array.prototype.push.apply(files, mainFiles);

      gulp.src(files)
        .pipe($.sourcemaps.init())
        .pipe(
          $.babel({"presets": ["@babel/env"]}).on('error', function (error) {
            console.log(error);
            this.emit('end');
          })
        )
        // .pipe($.concat(store + '-application.js'))
        .pipe($.concat('euro-application.js'))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('build/arquivos/'))
        .pipe($.connect.reload());
    }
  });



  done();
  return;
});

gulp.task('js:legacy', function () {
  return gulp.src(['assets/js/*.js'])
    .pipe(gulp.dest('build/arquivos/'))
    .pipe($.connect.reload());
});

gulp.task('js', gulp.series('js:main', 'js:legacy', (done) => done()));


//    _                                _       _                 _            _
//   (_) __ ___   ____ _ ___  ___ _ __(_)_ __ | |_            __| | ___ _ __ | | ___  _   _
//   | |/ _` \ \ / / _` / __|/ __| '__| | '_ \| __|  _____   / _` |/ _ \ '_ \| |/ _ \| | | |
//   | | (_| |\ V / (_| \__ \ (__| |  | | |_) | |_  |_____| | (_| |  __/ |_) | | (_) | |_| |
//  _/ |\__,_| \_/ \__,_|___/\___|_|  |_| .__/ \__|          \__,_|\___| .__/|_|\___/ \__, |
// |__/                                 |_|                            |_|            |___/

gulp.task('js:deploy', function () {
  return gulp.src('build/arquivos/*.js')
    .pipe($.stripComments())
    .pipe($.uglify())
    //.pipe($.header(bannerFiles))
    .pipe(gulp.dest('deploy/js/'));
});


//      _         _
//  ___| |_ _   _| | ___  ___
// / __| __| | | | |/ _ \/ __|
// \__ \ |_| |_| | |  __/\__ \
// |___/\__|\__, |_|\___||___/
//          |___/

gulp.task('sass', function () {
  return gulp.src('assets/css/**/*.scss')
    .pipe($.compass({
      css: __dirname +'/build/arquivos/',
      sass: __dirname +'/assets/css/',
      image: __dirname +'/assets/img/',
      generated_images_path: __dirname +'/build/arquivos/',
      relative_assets: true,
      sourcemap: false
    }))
    .on('error', function (error) {
      console.log(error);
      this.emit('end');
    })
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('build/arquivos/'))
    .pipe($.connect.reload());
});

gulp.task('css', function () {
  return gulp.src('assets/css/*.css')
    .pipe(gulp.dest('build/arquivos/'))
    .pipe($.connect.reload());
});


//      _         _                         _            _
//  ___| |_ _   _| | ___  ___            __| | ___ _ __ | | ___  _   _
// / __| __| | | | |/ _ \/ __|  _____   / _` |/ _ \ '_ \| |/ _ \| | | |
// \__ \ |_| |_| | |  __/\__ \ |_____| | (_| |  __/ |_) | | (_) | |_| |
// |___/\__|\__, |_|\___||___/          \__,_|\___| .__/|_|\___/ \__, |
//          |___/                                 |_|            |___/

gulp.task('sass:deploy', function () {
  return gulp.src('build/arquivos/*.css')
    .pipe($.cssmin())
    .on('error', function (error) {
      console.log(error);
      this.emit('end');
    })
    //.pipe($.header(bannerFiles))
    .pipe(gulp.dest('deploy/css/'));
});


//  _
// (_)_ __ ___   __ _
// | | '_ ` _ \ / _` |
// | | | | | | | (_| |
// |_|_| |_| |_|\__, |
//              |___/

gulp.task('img', function () {
  return gulp.src('assets/img/*.{jpg,png,gif}')
    .pipe(gulp.dest('build/arquivos/'))
    .pipe($.connect.reload());
});


//  _                               _            _
// (_)_ __ ___   __ _            __| | ___ _ __ | | ___  _   _
// | | '_ ` _ \ / _` |  _____   / _` |/ _ \ '_ \| |/ _ \| | | |
// | | | | | | | (_| | |_____| | (_| |  __/ |_) | | (_) | |_| |
// |_|_| |_| |_|\__, |          \__,_|\___| .__/|_|\___/ \__, |
//              |___/                     |_|            |___/

gulp.task('img:deploy', function () {
  return gulp.src('build/arquivos/*.{png,jpg,gif}')
    // .pipe($.imageOptimization({
    //   optimizationLevel: 7,
    //   progressive: true,
    //   interlaced: true
    // }))
    .pipe(gulp.dest('deploy/img/'));
});


//                _       _
// __      ____ _| |_ ___| |__
// \ \ /\ / / _` | __/ __| '_ \
//  \ V  V / (_| | || (__| | | |
//   \_/\_/ \__,_|\__\___|_| |_|

gulp.task('watch', function () {
	gulp.watch(['assets/css/*.css'], gulp.series('css'));
	gulp.watch(['assets/css/**/*.scss', 'assets/img/sprite/*.png'], gulp.series('sass'));
	gulp.watch(['assets/js/**/*.js', 'vendor.json'], gulp.series('js'));
	gulp.watch(['assets/vendor/**/*.js'], gulp.series('js'));
	gulp.watch(['assets/img/*.{jpg,png,gif}'], gulp.series('img'));
});


//  _           _ _     _
// | |__  _   _(_) | __| |
// | '_ \| | | | | |/ _` |
// | |_) | |_| | | | (_| |
// |_.__/ \__,_|_|_|\__,_|

gulp.task('build', gulp.parallel('js', 'img', 
	gulp.series('sass', 'css')
));


//      _            _
//   __| | ___ _ __ | | ___  _   _
//  / _` |/ _ \ '_ \| |/ _ \| | | |
// | (_| |  __/ |_) | | (_) | |_| |
//  \__,_|\___| .__/|_|\___/ \__, |
//            |_|            |___/

// gulp.task('deploy', function (cb) {
//   return runSequence('clean', 'build', ['js:deploy', 'sass:deploy', 'img:deploy'], cb);
// });

gulp.task('deploy', 
  gulp.series('clean', 'build', 
	gulp.parallel('js:deploy', 'sass:deploy', 'img:deploy')
  )
)

//      _       __             _ _
//   __| | ___ / _| __ _ _   _| | |_
//  / _` |/ _ \ |_ / _` | | | | | __|
// | (_| |  __/  _| (_| | |_| | | |_
//  \__,_|\___|_|  \__,_|\__,_|_|\__|

// gulp.task('default', function (cb) {
//   return runSequence('clean', ['connect', 'build', 'watch'], cb);
// });

gulp.task('serve',
	gulp.series('clean', 'connect', 'build', 'watch')
);


gulp.task('start',
	gulp.parallel('watch', 'serve')
);
