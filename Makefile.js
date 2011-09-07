require('smoosh').config({
  "JAVASCRIPT": {
    "DIST_DIR": "./dist",
    "script": ['./src/header.js', './src/script.js']
  },
  "JSHINT_OPTS": {
    "boss": true,
    "forin": false,
    "curly": true,
    "debug": false,
    "devel": false,
    "evil": false,
    "regexp": false,
    "undef": false,
    "sub": true,
    "asi": true
  }
}).run().build().analyze();