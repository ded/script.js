# GNU Makefile
# 
# Setting up your build environment
# =================================
# These instructions should help you get started
# and set up your environment to produce repeatable
# builds of script.js
#
# What you need installed in order to proceed
# -------------------------------------------
# 1. Python 2.5+
# 2. Java 1.6+
# 3. Pip (Python package management): 
#    http://pypi.python.org/pypi/pip
#    (Installing pip on OS X is detailed below)
# 4. XCode (Mac OS X only)
# 5. git
# 6. GNU make
#
# Additional Mac OS X notes:
# -------------------------
# If you're using OS X, it's advisable to use Homebrew
# to manage packages and installation:
# 
#     http://mxcl.github.com/homebrew/
#
# Follow the instructions at the above Website to
# install homebrew, grab a cup of coffee and be back here.
# 
# Installing pip after installing home brew is as easy as
# 
#     brew install pip
#
# Yeesh. That's a ton of package management tools already.
# But wait, there's more!
#
# Installing the "Developer SDK"
# ------------------------------
# Squeeze is a tool that bundles together yuicompressor, 
# google closure compiler, and other tools. We just
# need the yuicompressor and the closure compiler for 
# script.js:
#
#     pip install squeeze
#
# script.js can also be minified using 
# [UglifyJS](https://github.com/mishoo/UglifyJS),
# (which is turning out to be a darn good minifier. 
# So, uglifyjs uses nodejs and nodejs has its own package
# manager called npm. So we need the latter two programs
# installed before we install uglifyjs. OK, I lied.
# UglifyJS doesn't use npm, but npm will prove *very*
# handy, so install it anyway.)
#
# 1. Install nodejs
#    https://github.com/ry/node/wiki/Installation
#  
#    Mac OS X + Homebrew
#    -------------------
#    If you did install homebrew earlier, you're in for 
#    treat. Just type into your terminal:
#
#        brew install node
#   
# 2. Install npm
#    http://npmjs.org/
#
#    Usually:
#
#       curl http://npmjs.org/install.sh | sh
#
# 3. UglifyJS
#    So, jQuery 1.5 now uses UglifyJS. Hmmm.
#
#    $ mkdir -p ~/.node_libraries/
#    $ git clone --recursive git://github.com/mishoo/UglifyJS.git ~/.node_libraries/uglify-js    
#
#    Add this line to your ~/.profile (OS X) or ~/.bashrc file
#    export PATH=$HOME/.node_libraries/uglify-js/bin:$PATH
#
#    $ source ~/.profile   # or ~/.bashrc if you used that instead (say on Ubuntu).
#
# How to build a distributable release
# ====================================
# Clone the source repository:
#
#     $ git clone --recursive git://github.com/polvero/script.js.git
#     $ make
#
# Phew!
# PS. Yes, I know that's like 15 more commands to get 2 commands to work. 
# But it's the right way. Cheers.

SQUEEZE=squeeze
UGLIFYJS=uglifyjs
GZIP=gzip
GUNZIP=gunzip
COFFEE=coffee
DIST_DIR=_build
SRC_DIR=src

.PHONY: all clean

all: distdir script1 script-coffee
	@gzip $(DIST_DIR)/*.js
	@ls -laG $(DIST_DIR)/*
	@gunzip $(DIST_DIR)/*.gz

distdir:
	@mkdir -p $(DIST_DIR)

script1: $(DIST_DIR)/script.yui.js $(DIST_DIR)/script.uglifyjs.js $(DIST_DIR)/script.closure.js $(DIST_DIR)/script.js 

script-coffee: $(DIST_DIR)/script-coffee.yui.js $(DIST_DIR)/script-coffee.uglifyjs.js $(DIST_DIR)/script-coffee.closure.js $(DIST_DIR)/script-coffee.js docs/script-coffee.html


##################################################################
# Coffeescript version
$(DIST_DIR)/script-coffee.js: $(SRC_DIR)/script-coffee.coffee
	@echo "[coffee] Compiling Coffeescript"
	@$(COFFEE) -b -c -p $< > $@

# Minification
$(DIST_DIR)/script-coffee.yui.js: $(DIST_DIR)/script-coffee.js
	@echo "[coffee] Minifying using YUICompressor"
	@$(SQUEEZE) yuicompressor --type=js $< > $@

$(DIST_DIR)/script-coffee.uglifyjs.js: $(DIST_DIR)/script-coffee.js
	@echo "[coffee] Minifying using UglifyJS"
	@$(UGLIFYJS) $< > $@

$(DIST_DIR)/script-coffee.closure.tmp.js: $(DIST_DIR)/script-coffee.js
	@echo "[coffee] Minifying using Google Closure"
	@$(SQUEEZE) closure --js $< --js_output_file $@

$(DIST_DIR)/script-coffee.closure.js: $(SRC_DIR)/header.js $(DIST_DIR)/script-coffee.closure.tmp.js
	@echo "[coffee] Adding license header to closure build."
	@cat $(SRC_DIR)/header.js $(DIST_DIR)/script-coffee.closure.tmp.js > $@

docs/script-coffee.html: $(SRC_DIR)/script-coffee.coffee
	@echo "[coffee:docco] Generating documentation"
	@docco $(SRC_DIR)/*.coffee

###################################################################
# Plain JS.
$(DIST_DIR)/script.js: $(SRC_DIR)/header.js $(SRC_DIR)/script.js
	@echo "[plain] Producing plain JavaScript file"
	@cat $(SRC_DIR)/header.js $(SRC_DIR)/script.js > $@

# Minification
$(DIST_DIR)/script.yui.js: $(DIST_DIR)/script.js
	@echo "[plain] Minifying using YUICompressor"
	@$(SQUEEZE) yuicompressor --type=js $< > $@

$(DIST_DIR)/script.uglifyjs.js: $(DIST_DIR)/script.js
	@echo "[plain] Minifying using UglifyJS"
	@$(UGLIFYJS) $< > $@

$(DIST_DIR)/script.closure.tmp.js: $(DIST_DIR)/script.js
	@echo "[plain] Minifying using Google Closure"
	@$(SQUEEZE) closure --js $< --js_output_file $@

$(DIST_DIR)/script.closure.js: $(SRC_DIR)/header.js $(DIST_DIR)/script.closure.tmp.js
	@echo "[plain] Adding license header to closure build."
	@cat $(SRC_DIR)/header.js $(DIST_DIR)/script.closure.tmp.js > $@

clean:
	@-rm -f $(DIST_DIR)/script*.js $(DIST_DIR)/*.gz
	@-rm -rf docs/
