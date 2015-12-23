Installation
-------------
This is a node module containing a class.

You can install it via npm like so:
```
npm install coloured-prose
```

I am in the process of making a client side version of this.

It can be used in your code like so:
```
var ColouredProse = require('coloured-prose');

var vowels = 'a,e,y,u,i,o'.split(',');
var colouredProse = new ColouredProse(someVowels);
```

Contributing
-------------
Just fork the project! Please use Test Driven Development in conjunction with mocha.
Just run `mocha test` to see what I mean.
