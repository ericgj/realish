var identical = function(val){ return val; }

module.exports = Realish;

function Realish(data,spec){
  if (!(this instanceof Realish)) return new Realish(data,spec);
  this.data = data;
  this._transforms = {};
  this._excludes = [];
  if (spec) this.applySpec(spec);
}

// TODO throw error if no function this[spec[name]]
Realish.prototype.applySpec = function(spec){
  for (var name in spec){
    this[spec[name]](name);
  }
  return this;
}

Realish.prototype.fake = function(name, fn){
  this._transforms[name] = fn || identical;
  return this;
}

Realish.prototype.obscure = function(name, matcher, ch){
  return this.fake(name, Realish.obscure(matcher,ch));
}

Realish.prototype.obscureDigits = function(name, ch){
  return this.fake(name, Realish.obscureDigits(ch));
}

Realish.prototype.obscureWords = function(name, ch){
  return this.fake(name, Realish.obscureWords(ch));
}

Realish.prototype.scramble = function(name, matcher){
  return this.fake(name, Realish.scramble(matcher));
}

Realish.prototype.scrambleDigits = function(name){
  return this.fake(name, Realish.scrambleDigits());
}

Realish.prototype.scrambleWords = function(name){
  return this.fake(name, Realish.scrambleWords());
}

Realish.prototype.randomRecord = function(name, other){
  return this.fake(name, Realish.randomRecord(other || name));
}

Realish.prototype.randomEmail = function(name){
  return this.fake(name, Realish.randomEmail(name));
}

Realish.prototype.random = function(name, choices){
  return this.fake(name, Realish.random(choices));
}

Realish.prototype.exclude = function(){
  for (var i=0;i<arguments.length;++i){
    var name = arguments[i];
    this._transforms[name] && delete this._transforms[name];
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
      if (~indexOf(this._excludes,name)) continue;
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
    if (!val) return val;
    return val.replace(matcher || /./g, ch || '*'); 
  };
}

Realish.obscureDigits = function(ch){ return this.obscure(/\d/g,ch); }
Realish.obscureWords  = function(ch){ return this.obscure(/\w/g,ch); }

Realish.scramble = function(matcher){
  return function(val){ 
    if (!val) return val;
    var ms = val.match(matcher || /./g)
      , shuf = shuffle(ms);
    return val.replace(matcher,function(){return shuf.shift();});
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

Realish.randomEmail = function(name){
  return function(){
    var e1 = Realish.randomRecord(name).call(this),
        e2 = Realish.randomRecord(name).call(this),
        e3 = Realish.randomRecord(name).call(this)
    if (!(e1 || e2 || e3)) return null;
    return (e1 || e2 || e3).match(/^[^@]+(?=@)/)[0] + 
           (e2 || e3 || e1).match(/@[^\.]+/)[0] +
           (e3 || e1 || e2).match(/\.\w+$/)[0];
  }
}
           
// private

function indexOf(arr,obj){
  if ([].indexOf) return arr.indexOf(obj);
  for (i=0;i<arr.length;++i){
    if (arr[i] === obj) return i;
  }
  return -1;
}

function randomArrayIndex(input) {
  return Math.floor(Math.random() * (input.length)); 
}

function randomArrayElement(input) {
  return input[ randomArrayIndex(input) ];
}

function shuffle(input){
  var c = input.slice()
    , ret = []
  while (c.length > 0){
    var i = randomArrayIndex(c);
    ret.push( c.splice(i,1)[0] );
  }
  return ret;
}


