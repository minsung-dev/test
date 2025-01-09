const createError = require("http-errors");

exports.handleNotFound = function (req, res, next) {
  next(createError(404));
};

exports.handleError = function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('common/error.njk', {error: err, message: err.message || '잘못된 요청입니다.'});
};


