var express = require('express');
var app = express();
var http = require('http');
var cors = require('cors');
require('dotenv').config();
require('./config.js');
var bodyParser = require('body-parser');
var log4js = require('log4js');
var logger = log4js.getLogger('tcib-admin');
var debug = require('debug')('secure:server');


//Bodey Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

//cors
app.options('*', cors());
app.use(cors());



///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// START SERVER /////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var host = process.env.HOST;
var port = normalizePort(process.env.PORT);
app.set('port', port);
var server = http.createServer(app).listen(port);
logger.info('------------------- SERVER STARTED -----------------------');
logger.info('***************  http://%s:%s  ******************', host, port);
server.timeout = 240000;
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ?
    'pipe ' + addr :
    'port ' + addr.port;
  debug('Listening on ' + bind);
}
//////////////////////////////// END START SERVER /////////////////////////////////



//routes
var routes = require('./api/routes');
app.use('/', routes);