word_list = [ 'TURING', 'ENIGMA', 'HACKER' ];

exports.QRGame = function(word) {
    this.word = "TURING";
    this.scrambled = this.generateScrambled();
    this.scanned = "";
    this.guessed = "";
}

exports.QRGame.prototype.generateScrambled = function() {
	var scrambled = new Array();
	var letters = this.word.split('');
	letters.shuffle();
    return letters.join('');
};

exports.QRGame.prototype.guessWord = function(guess) {
	if (guess.toUpperCase() == this.word) {
		return true;
	} else {
		return false;
	}
};

exports.QRGame.prototype.addScanned = function(letter) {
	this.scanned = this.scanned + letter.toUpperCase();
};

exports.QRGame.prototype.addGuessed = function(letter) {
	this.guessed = this.guessed + letter.toUpperCase();
};

