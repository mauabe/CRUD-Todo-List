const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

exports.id = '00000';

exports.zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

exports.readCounter = (callback) => {
  fs.readFile(exports.counterFile, {encoding: 'utf-8', flag: 'r'}, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, fileData);
    }
  });
};

exports.writeCounter = (count, callback) => {
  var counterString = this.zeroPaddedNumber(count);
  exports.id = counterString;
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (cb) => {
  let counter = 0;
  let that = this;

  function writing(num) {
    if (num){
      counter = Number(num.slice(1, num.length)) +1;
    } else { counter = 1; }
    that.writeCounter(counter, (err, count) => {
      // console.log('wrote count: ', count)
      cb();
    });
  }
  this.readCounter( (err, num) => { writing(num); } );
};


// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');