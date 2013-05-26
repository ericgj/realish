var Realish =  require('../index.js')
  , assert = require('assert')
//  , stub   = require('ministub');

module.exports = {

  beforeEach: function(){
    this.data = [
      { name: "John Fogarty", email: "john@ccr.com", phone: "123-456-7890" },
      { name: "Chuck Berry", email: "rocknroll@johnnyb.org", phone: "234-567-8901" },
      { name: "Davy Jones", email: "lasttrain@clarksville.edu", phone: "345-678-9010" },
      { name: "John Lennon", phone: "020-3034-0505"},
      { name: "Neil Young", email: "needle@damage.mx"}
    ]

    this.subject = new Realish(this.data);
  },

  "passthrough": function(){
    var actual = this.subject.get();
    assert.equal(actual.length, this.data.length);
    for (var i=0;i<actual.length;++i){
      var rec = actual[i]; expRec = this.data[i];
      for (var fld in rec){
        assert.equal(rec[fld],expRec[fld]);
      }
    }
  },

  "exclude": function(){
    var actual = this.subject.exclude('name','phone').get();
    assert.equal(actual.length, this.data.length);
    for (var i=0;i<actual.length;++i){
      if (this.data[i].email)
        assert.equal(actual[i].email, this.data[i].email);
      assert(!actual[i].name);
      assert(!actual[i].phone);
    }
  },

  "obscure": function(){
    var actual = this.subject.obscure('email').get();
    assert.equal( actual[0].email, '************' );
    assert.equal( actual[0].name, this.data[0].name );
    assert.equal( actual[0].phone, this.data[0].phone );
  },

  "obscureDigits": function(){
    var actual = this.subject.obscureDigits('phone', 'x').get();
    assert.equal( actual[3].phone, 'xxx-xxxx-xxxx');
  },

  "obscureWords": function(){
    var actual = this.subject.obscureWords('name', '-').get();
    assert.equal( actual[4].name, '---- -----');
  }

  /* unclear how to test this ATM
    "scrambleDigits": function(){
      var actual = this.subject.scrambleDigits('phone').get();
      assert.equal( actual[1].phone, this.data[1].phone);
    }
  */

}
