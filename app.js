
/**
 * Module dependencies.
 */

var express = require('express');
var nodeunit = require('nodeunit');
var events = require('events');

// includes
require('./utilities.js');
var qrgame = require('./qrgame.js');

// globals
var title = 'QR CodeBreakers';
var players = new Array();
// these have keys of the username, and values of the game object
var solo_games = new Array();
var multiplayer_games = new Array();

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  // added
  app.use(express.cookieParser());

  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  username = req.cookies.username;
  console.log('username='+username)
  if (!username) {
    res.redirect('/login');
  } else {
    if (!players.inArray(username, true)) {
      players.push(username);
      console.log('implicitly added ' + username + ' to players: ' + players);
    }  
    res.render('index', {
      head: '<script src="/socket.io/socket.io.js"></script>\n<script src="/javascripts/mmprpssl.js"></script>',
      title: title,
      username: username
    });
  }
});

app.get('/login', function(req, res){
  res.render('login', {
    head: '',
    title: title,
    message: 'Please log in'
  });
});
    
app.post('/login', function(req, res){
  // (use the bodyParser() middleware for this)
  var nick = req.body.nick;
  players.push(nick);
  console.log('added ' + nick + 'to players: ' + players);
  res.cookie('username', nick);
  res.redirect('/');
});

app.get('/logout', function(req, res){
  username = req.cookies.username;
  console.log('username '+username+' has logged out')
  if (username) {
    res.clearCookie('username');
    players.remove(username);
  }
  res.render('login', {
    head: '',
    title: title,
    message: 'You have been logged out'
  });
});
    

app.listen(3000);
console.log("Express server listening on port %d", app.address().port);

// log
console.log('using mode ' + process.env.NODE_ENV);
