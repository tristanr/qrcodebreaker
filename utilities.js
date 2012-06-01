// bullshit patch because javascript can't check if something's in an Array
// from http://www.guyfromchennai.com/?p=28
Array.prototype.inArray = function (value,caseSensitive)
// Returns true if the passed value is found in the
// array. Returns false if it is not.
{
var i;
for (i=0; i < this.length; i++) {
// use === to check for Matches. ie., identical (===),
if(caseSensitive){ //performs match even the string is case sensitive
if (this[i].toLowerCase() == value.toLowerCase()) {
return true;
}
}else{
if (this[i] == value) {
return true;
}
}
}
return false;
};

// bullshit patch because javascript can't remove something from an Array
// from http://stackoverflow.com/questions/3954438/remove-item-from-array-by-value-javascript
Array.prototype.remove= function(){
    var what, a= arguments, L= a.length, ax;
    while(L && this.length){
        what= a[--L];
        while((ax= this.indexOf(what))!= -1){
            this.splice(ax, 1);
        }
    }
    return this;
}


Array.prototype.shuffle = function() {
var s = [];
while (this.length) s.push(this.splice(Math.random() * this.length, 1)[0]);
while (s.length) this.push(s.pop());
return this;
}