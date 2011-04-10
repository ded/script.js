require('smoosh').config({
  "JAVASCRIPT": {
    "DIST_DIR": "./dist",
    "script": ['./src/header.js', './src/script.js']
  },
  "JSHINT_OPTS": {
    "boss": true,
    "forin": true,
    "curly": true,
    "debug": false,
    "devel": false,
    "evil": false,
    "regexp": false,
    "undef": false,
    "sub": false,
    "asi": false
  }
}).run().build().analyze();