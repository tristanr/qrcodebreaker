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
  app.set('basepath', '/');
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

app.get('/c/:no', function(req, res){
  var no = req.params.no;
  var username = req.cookies.username;
  console.log('username='+username);
  console.log('cookies'+ req.cookies);
  console.log('page no='+req.params.no);
  console.log('players='+players);
  console.log('solo_games='+solo_games);
  console.log('multiplayer_games='+multiplayer_games);
  for (un in multiplayer_games) {
   //console.log('got ' + un + ' with ' + multiplayer_games[un]);
  }

	for (var un in multiplayer_games) {
	  if (multiplayer_games.hasOwnProperty(un)) { 
	  // or if (Object.prototype.hasOwnProperty.call(obj,prop)) for safety...
       console.log('gotted ' + un + ' with ' + multiplayer_games[un]);
	  }
	}

if (!username) {
    res.redirect('/q/login/'+no);
  } else {
    if (!players.inArray(username, true)) {
      players.push(username);
      console.log('implicitly added ' + username + ' to players: ' + players);
    }  
    if (solo_games[username] == undefined && multiplayer_games[username] == undefined && !req.query['new']) {
        console.log('welcome');
		res.render('welcome', {
		  head: '', //<script src="/socket.io/socket.io.js"></script>\n<script src="/javascripts/mmprpssl.js"></script>',
		  title: title,
		  username: username,
		  no: no
		});

    } else {
    	if (req.query['new']) {
 		  console.log('new game: ' + req.query['new']);
    	  game = new qrgame.QRGame();
    	  if (req.query['new'] == 'solo') {
    	  	solo_games[username] = game;
    	  } else {
    	    multiplayer_games[username] = game;
    	  }
    	}

		if (solo_games[username] != undefined) {
		  gametype = 'solo';
		  game = solo_games[username];
		} else if (multiplayer_games[username] != undefined) {
		  gametype = 'multi';
		  game = multiplayer_games[username]
		} else {
		  gametype = 'dunno';
		}
	  console.log('multiplayer_game='+multiplayer_games[username]);

		console.log('normal view with gametype ' + gametype + ' and mode ' + game.mode + ' and no ' + no);
		letter = game.scrambled.charAt(no*1-1);
		console.log(game.scrambled + ' gives ' + letter );

		var message = '';		
		if (game.mode == 'intercept') {
			console.log('added ' + letter + ' to scanned');
			game.scanned = game.scanned + letter;
		}
		if (game.mode == 'decrypt') {
			var pos = game.guessed.length;
			console.log('decrypted ' + letter + ' for pos ' + pos);
			if (letter == game.word.charAt(pos) ) {
			  game.guessed = game.guessed + letter;
			  if (game.guessed.length == 6) {
    			  message = 'You have won! Show your phone to all the other players and gloat.';
     		  } else {
    			  message = 'Correct!';
 			  }
			} else {
			  posno = pos + 1;
			  message = 'Wrong! The letter at position ' + posno + ' is not ' + letter + '. Try again!';
			}
			console.log('msg: ' + message);
		}
		
		res.render('index', {
		  head: '', //<script src="/socket.io/socket.io.js"></script>\n<script src="/javascripts/mmprpssl.js"></script>',
		  title: title,
		  username: username,
		  gametype: gametype,
		  letter: letter,
	      no: req.params.no,
		  players : players,
		  multiplayer_games : multiplayer_games,
		  message: message
		});
    }
  }
});

app.get('/q/decrypt', function(req, res){
  username = req.cookies.username;
  console.log('username '+username+' has gone decypt');
  game = multiplayer_games[username]
  game.mode = 'decrypt';  
  res.render('decrypt', {
    head: '',
    title: title,
    message: 'You have switched to decrypt mode'
  });
});
    
app.get('/q/intercept', function(req, res){
  username = req.cookies.username;
  console.log('username '+username+' has gone intercept');
  game = multiplayer_games[username]
  game.mode = 'intercept';  
  res.render('intercept', {
    head: '',
    title: title,
    message: 'You have switched to intercept mode'
  });
});
    
app.get('/q/instructions/:no', function(req, res){
  username = req.cookies.username;
  console.log('username '+username+' has read instructions');
  res.render('instructions', {
    head: '',
    title: title,
    no: req.params.no,
    message: ''
  });
});
    

app.get('/q/login/:no', function(req, res){
  res.render('login', {
    head: '',
    title: title,
    message: 'Please log in',
    no: req.params.no
  });
});
    
app.post('/q/login/:no', function(req, res){
  // (use the bodyParser() middleware for this)
  var nick = req.body.nick;
  players.push(nick);
  console.log('added ' + nick + 'to players: ' + players);
  res.cookie('username', nick, { path: '/' });
  console.log('redirct to ' + req.params.no);
  res.redirect('/c/'+req.params.no);
});

app.get('/q/logout/:no', function(req, res){
  username = req.cookies.username;
  console.log('username '+username+' has logged out')
  if (username) {
    res.clearCookie('username');
    players.remove(username);
  }
  res.render('login', {
    head: '',
    title: title,
    no: req.params.no,
    message: 'You have been logged out'
  });
});
    

app.listen(3000);
console.log("Express server listening on port %d", app.address().port);

// log
console.log('using mode ' + process.env.NODE_ENV);
