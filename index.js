// realish(data).fake('email', realish.obscureDigits() ).get()

var identical = function(val,rec){ return rec[val]; }

module.exports = Realish;

function Realish(data){
  if (!(this instanceof Realish)) return new Realish(data);
  this.data = data;
  this._transforms = {};
  this._excludes = [];
}

Realish.prototype.fake = function(name, fn){
  this._transforms[name] = fn || identical;
  return this;
}

Realish.prototype.exclude = function(){
  for (var i=0;i<arguments.length;++i){
    var name = arguments[i];
    this._transforms[name] && delete this._transforms[var];
    this._excludes.push(name);
  }
  return this;
}

Realish.prototype.toJSON = 
Realish.prototype.get = function(){
  ret = [];
  for (var i=0;i<this.data.length;++i){
    var rec = this.data[i];
    var newRec = {};
    for (var name in rec){
      if (indexOf(rec[name],this._excludes)) continue;
      var fn = this._transforms[name] || identical
      newRec[name] = fn.call(this,rec[name],rec,i);
    }
    ret.push(newRec);
  }
  return ret;
}

// statics

Realish.obscure = function(matcher,ch){
  return function(val){ 
    return val.replace(matcher || /./g, ch || '*'); 
  };
}

Realish.obscureDigits = function(ch){ return this.obscure(/\d/g,ch); }
Realish.obscureWords  = function(ch){ return this.obscure(/\w/g,ch); }

Realish.scramble = function(matcher){
  return function(val){ 
    ms = val.match(matcher || /./g);
    args = shuffle(ms); args.unshift(matcher);
    return val.replace.apply(val,args);
  }
}

Realish.scrambleDigits = function(){ return this.scramble(/\d/g); }
Realish.scrambleWords = function(){ return this.scramble(/\w+/g); }

Realish.randomRecord = function(name){
  return function() { 
    return randomArrayElement(this.data)[name];
  }
}

Realish.random = function(choices){
  return function() {
    return randomArrayElement(choices);
  }
}


// private

function randomArrayElement(input) {
  return input[ Math.floor(Math.random() * (input.length + 1)) ];
}

function shuffle(input){
    var perms = permute(input)
    return randomArrayElement(perms);
}

function permute(input) {
    var permArr = [],
    usedChars = [];
    function main(input){
        var i, ch;
        for (i = 0; i < input.length; i++) {
            ch = input.splice(i, 1)[0];
            usedChars.push(ch);
            if (input.length == 0) {
                permArr.push(usedChars.slice());
            }
            main(input);
            input.splice(i, 0, ch);
            usedChars.pop();
        }
        return permArr;
    }
    return main(input);
};

