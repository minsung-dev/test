const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const nunjucks = require('nunjucks');
const {exceptionMiddleware, preHandler} = require("./src/middleware");
const fs = require("fs");


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'njk');

const nunjucksEnv = nunjucks.configure([path.join(__dirname, 'views')], {
  autoescape: true,
  express: app,
  noCache: true,
  watch: true,
});
nunjucksEnv.addFilter('comma', (str) => {
  str = String(str);
  return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
});

nunjucksEnv.addFilter('uncomma', (str) => {
  str = String(str);
  return str.replace(/[^\d]+/g, '');
});

// nginx 대응코드
app.set('trust proxy', true);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**************** 전처리 ****************/
app.use(preHandler)

/**************** 라우팅 ****************/


function appendEndpointDir(dir, prefix) {
  fs.readdirSync(dir).forEach((filename) => {
    const filepath = path.join(dir, filename);

    if (fs.lstatSync(filepath).isDirectory()) {
      appendEndpointDir(filepath, `${prefix}${filename}/`);
      return;
    }

    let parts = filename.split('.');
    if (!parts[1] || parts[1] !== 'js') {
      return;
    }

    const routePath = path.join(prefix, parts[0] !== 'index' ? parts[0] : '');
    app.use(routePath, require(dir + '/' + filename));
  });
}

appendEndpointDir(path.join(__dirname, '/src/routes'), '/');

/**************** 후처리 ****************/

// error handler
app.use(exceptionMiddleware.handleError);

// catch 404 and forward to error handler
app.use(exceptionMiddleware.handleNotFound);


module.exports = app;
