
# realish

  Data faking/obfuscation library based on real data.

  Most data faking libraries generate dummy data for you. This library
  takes your _existing_ data and mangles or obscures parts of it that
  you don't want public, but otherwise leaves it intact. The resulting
  data is "real-ish" rather than "fake".

  Designed for the typical case of generating sample data for 
  demonstrations, or for test fixtures, etc. where you don't want 
  sensitive info projected to the room or in your repository, but you
  need more realistic data than that produced by random generation.

## Installation

  Via npm:

    $ npm install realish

  Or as a [component][component]:
  
    $ component install ericgj/realish

## Usage

```javascript
var faked = Realish(data)
              .obscureDigits('ssn')
              .scrambleWords('secret')
              .randomRecord('lastname')
              .randomEmail('email')
              .random('status', ['single','married','dependent',null])
              .fake('firstname', function(val,rec,recno){ return rec.codename; })
              .exclude('salt','key','bankno')

process.stdout.write(JSON.stringify(faked));
```

or command-line:

    $ realish filter.json < input.json > output.json

## API

TODO

## License

  MIT

[component]: https://github.com/component/component
