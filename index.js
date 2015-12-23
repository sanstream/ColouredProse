#!/usr/bin/env node
var Hypher = require('hypher');
var english = require('hyphenation.en-us');

/**
 * Creates colour versions for any type of prose based on the syllables used in
 * that piece of text.
 */
function ColouredProse (vowels) {
  this.vowels = vowels;
  this.syllabelisedText = [];
  this.colourisedText = [];
  this.vowelRegExps = this.createVowelRegExps();
  this.vowelsToHue = this.mapVowelsToColours();
  this.hypher = new Hypher(english);
};

/**
 * Chops up the file lines
 * @param  {String} data  The piece of prose in a single string.
 * @param  {String?} eolCharacters What EOL characters to expect '\n' or '\r\n'. Defaults to "\n".
 * @return {Array.<String[]>}  Returns a nested array of syllabised lines.
 */
ColouredProse.prototype.chopUpString = function (data, eolCharacters) {
  var eolCharacters = (eolCharacters === "\n\r" || eolCharacters === "\n\r")? eolCharacters : "\n";
  return data.split('\n').map(function(line) {
    var lineSyllables = [];
    line.trim().replace(/[\?\!\.\,\:\;]/g,'').split(' ').forEach(function(word) {
        this.hypher.hyphenate(word).forEach(function(syllable) {
          lineSyllables.push(syllable);
        }, this);
    }, this);
    return lineSyllables;
  }, this);
}

/**
 * Determines what color a syllable has.
 * @param  {String} syllable  A single syllable of a word.
 * @return {String}          A string representation of a css {@link hsl|https://developer.mozilla.org/nl/docs/Web/CSS/kleur_waarde#hsl()} colour.
 */
ColouredProse.prototype.colorize = function (syllable) {
  var numOfVowels = 0;
  var grayscale = 0;
  var hue  = 0;

  for (vowel in this.vowelRegExps) {
    var result = this.vowelRegExps[vowel].test(syllable);
    if(result){
      numOfVowels += 1;
      hue = this.vowelsToHue[vowel];
    }
  }
  if(numOfVowels > 1) {
    console.warn('syllable', syllable, ' has more than one vowel. The code assumes that this does not happen.');
  }

  grayscale = numOfVowels/syllable.length;
  return 'hsv('+ hue +','+ grayscale +'% ,50%)';
}

/**
 * Maps vowels to specific hues (colours) by distributing them evenly along the
 * range of all hues.
 * @return {Map}      An object of vowels mapped to specific hues.
 */
ColouredProse.prototype.mapVowelsToColours = function () {
  var map = {};
  this.vowels.forEach(function(vowel, index) {
    map[vowel] = (index / this.vowels.length) * 360;
  }, this);
  return map;
};

/**
 * Create as useful internal map for checking if vowels are in a string or not.
 * @return {Map}        An object of vowels mapped to Regular expression objects that match that vowel.
 */
ColouredProse.prototype.createVowelRegExps = function () {
  var map = {};
  this.vowels.forEach(function(vowel) {
     map[vowel] = new RegExp(vowel,'gi');
  });
  return map;
};

module.exports = ColouredProse;
