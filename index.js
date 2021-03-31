const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

require('dotenv').config();

require('./db/connection')
require('./config/passport');

// create express app
const app = express();
const port = process.env.port || 8080;

var certificate = fs.readFileSync('/etc/ssl/blockgamings.com/blockgamings.com.crt', 'utf8');
var privateKey = fs.readFileSync('/etc/ssl/blockgamings.com/blockgamings.com.key', 'utf8');
var caBundle = fs.readFileSync('/etc/ssl/blockgamings.com/gd_bundle-g2-g1.crt', 'utf8');

var credentials = { key: privateKey, cert: certificate, ca: caBundle };

// var httpServer = http.createServer(app);
var httpServer = https.createServer(credentials, app);

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, x-auth-token'
  );
  next();
});

glob('routes/', (err, routeFiles) => {
  if (err) {
    console.log(`Error traversing routes`, err);
    return;
  }

  routeFiles.forEach(file => {
    const route = require(path.resolve(file));

    app.use('/api', route);
  });

  // Models & routes
  // require('./models/Users');

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handler
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json(err);
  });
});

app.get('/', (req, res) => {
  res.send('app is running nodejs');
});

// listen for requests
httpServer.listen(port, function () {
  console.log('api is listening on port ' + port);
});
