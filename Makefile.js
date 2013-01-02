require('smoosh').config({
    "JAVASCRIPT": {
      "DIST_DIR": "./dist"
    , "script": ['./src/header.js', './src/script.js', './src/style.js']
  }
  , "JSHINT_OPTS": {
      "boss": true
    , "forin": false
    , "curly": false
    , "debug": false
    , "devel": false
    , "evil": false
    , "regexp": false
    , "undef": false
    , "sub": true
    , "white": false
    , "indent": 2
    , "whitespace": true
    , "asi": true
    , "laxbreak": true
    , "laxcomma": true
    , "eqeqeq": false
    , "eqnull": true
  }
}).run().build().analyze()
