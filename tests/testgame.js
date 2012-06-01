require('../utilities.js');
var qrgame = require('../qrgame.js');

exports.testWordList = function(test){
    test.ok(typeof(word_list) != 'undefined');
    test.ok(word_list.inArray('TURING'));
    test.ok(!word_list.inArray('FISH'));
    test.done();
};

exports.testNewGame = function(test){
	var game = new qrgame.QRGame('TURING');
    test.ok(typeof(game) != 'undefined');
    test.equal(game.word, 'TURING');
    test.equal(game.scrambled.length, 6);
    test.done();
};

exports.testMakeGuess = function(test){
	var game = new qrgame.QRGame('TURING');
    test.equal(game.guessed, '');
    game.addGuessed('u');
    test.equal(game.guessed, 'U');
    test.ok(game.guessWord('turing'));
    test.ok(!game.guessWord('tur'));
    test.done();
};

exports.testScan = function(test){
	var game = new qrgame.QRGame('TURING');
    test.equal(game.scanned, '');
    game.addScanned('u');
    test.equal(game.scanned, 'U');
    game.addScanned('G');
    test.equal(game.scanned, 'UG');
    test.done();
};