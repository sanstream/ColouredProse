var chai = require('chai');
var assert = require('assert');
var ColouredProse = require('../index');
// usefull data:
var vowels = 'a,e,y,u,i,o'.split(',');
var someVowels = 'a,e'.split(',');
var someConsonants = 'w,t'.split(',');

describe("ColouredProse", function() {

  describe(".createVowelRegExps()", function() {
    it("should create a map containing for each vowel a gobally matching expression", function(){
      var colouredProse = new ColouredProse(someVowels);
      // positive test:
      someVowels.forEach(function (vowel, index) {
        var regExp = colouredProse.vowelRegExps[vowel];
        assert.equal(regExp.test(vowel), true, "Vowel does not match RegExp");
        assert.equal(regExp.test(someConsonants[index]), false, "Consonant seems to match the vowel RegExp");
      });
    });
  });

  describe(".mapVowelsToColours()", function() {
    it("should map each vowel evenly to whole range of hues", function(){

      var vowels1 = 'a,e,y,u,i,o'.split(',');
      var colouredProse1 = new ColouredProse(vowels1);
      vowels1.forEach(function (vowel, index) {
        assert.equal(colouredProse1.vowelsToHue[vowel], index * 60, "colour mapping is incorrect");
      });

      var vowels2 = 'a,e,y'.split(',');
      var colouredProse2 = new ColouredProse(vowels2);
      vowels2.forEach(function (vowel, index) {
        assert.equal(colouredProse2.vowelsToHue[vowel], index * 120, "colour mapping is incorrect");
      });

      var vowels3 = 'a,e'.split(',');
      var colouredProse3 = new ColouredProse(vowels3);
      vowels3.forEach(function (vowel, index) {
        assert.equal(colouredProse3.vowelsToHue[vowel], index * 180, "colour mapping is incorrect");
      });
    });
  });

  describe(".chopUpString()", function() {
    it("should chop up a piece of prose in syllables group by their sentences.", function(){

      var prose = "This is a sentence for testing\n purpose.";
      var expectedResult = [["This", "is", "a", "sen","tence", "for", "test","ing"], ["pur","pose"]];

      var colouredProse = new ColouredProse('a,e,y,u,i,o'.split(','));
      var result = colouredProse.chopUpString(prose);

      assert.ok(Array.isArray(result), "The output it not an array.");
      assert.ok(Array.isArray(result[0]), "The output it not a nested array.");
      result.forEach(function (sentence, senI){
        sentence.forEach(function (syllable, sylI){
          assert.equal(result[senI][sylI], expectedResult[senI][sylI]);
        });
      });
    });
    it("should get rid of all punctuation", function(){

      var prose = "!,;:.a";
      var expectedResult = [["a"]];

      var colouredProse = new ColouredProse('a,e,y,u,i,o'.split(','));
      var result = colouredProse.chopUpString(prose);

      assert.ok(result[0][0] === expectedResult[0][0], "Could not get rid of: " + result[0][0].replace('a',''));
    });
  });

  describe(".colorize()", function() {
    it("should convert a syllable to a certain colour.", function(){
      var colouredProse = new ColouredProse('a,e,y,u,i,o'.split(','));
      var color = colouredProse.colorize("yd");
      console.log(color);
      assert.equal(color, "hsl(120,50%,50%)", "does not produce the right colour.");
    });
  });
});
