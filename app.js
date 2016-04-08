var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var port = 3020;

var numUsers = 0;

io.sockets.on('connection', function(socket){
  var addedUser = false;

  socket.on('addUser', function (param) {
    if (addedUser) return;

    // we store the username in the socket session for this client
    console.log("New User Joined: " + param.username);
    socket.username = param.username;
    ++numUsers;
    addedUser = true;
    // echo globally (all clients) that a person has connected
  });

  socket.on("newMessage", function(param){
    io.sockets.emit("resMessage", {"username": socket.username ,"message" : param.message});
  });

  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;
      // echo globally that this client has left
      socket.broadcast.emit('userLeft', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });

});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


server.listen(port, function(){
    console.log("Web Socket running in port: "+port);      
});

module.exports = app;
