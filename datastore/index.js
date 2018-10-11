const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  function cb() {
    var id = counter.id;
    var filename = 'data/' + id + '.txt';
    var pathname = path.join(__dirname, filename);
    fs.writeFile(pathname, text, {encoding: 'utf-8', flag: 'w+'});
    callback(null, {id: id, text: text});
  }
  counter.getNextUniqueId(cb);
};

exports.readOne = (id, callback) => {
  let pathname = path.join(exports.dataDir, id);
  fs.access( pathname, fs.constants.F_OK, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.readFileAsync(pathname, 'utf-8').then( (err, text) => {
        callback(null, {id: id, text: text});
      }).catch( (err) => { console.log('readone got an error', err) } );
    }
  });
};

exports.readAll = (callback) => {
  var data = [];
  var total = 1;

  function general(err, num) {
    
    fs.readdirAsync(exports.dataDir).then( (contents) => {
      contents.forEach ( each => {
        fs.readFileAsync(path.join(exports.dataDir, `${each}`), 'utf-8').then( text => {
          data.push( {id: each, text: text} );
          total++;
          if (total > contents.length) {
            callback(null, data);
          }
        }).catch(err => console.log(err));
      });
    });
  }
  counter.readCounter(general);
};

exports.update = (id, text, callback) => {
  // exports.readOne(id, (empty, obj) => {
  let pathname = path.join(exports.dataDir, id);
  fs.access( pathname, fs.constants.F_OK, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile( pathname, text);
    }
  });
  callback(null, {id: id, text: text});
};

exports.delete = (id, callback) => {
  
  var pathname = path.join(exports.dataDir, id);
  fs.access(pathname, fs.constants.F_OK, (err) => {
    if (err) {
      console.log(err);
    } else {
      fs.unlink(pathname, (err) => {
        if (err) {
          throw err;
        }
        callback();
        console.log('path/file.txt was deleted');
      });
    }
  });
};


// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
