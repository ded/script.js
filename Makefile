# GNU Makefile
#
# Huge props to Yesudeep Mangalapilly for creating this make
# https://github.com/gorakhargosh
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
# if this errors for you, you may try easy_install
#
#     sudo easy_install pip
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

.PHONY: all clean

all: script.min.js script.u.js script.c.js script.js

script.js: src/header.js src/script.js
	@cat src/header.js src/script.js > $@

script.min.js: script.js
	@echo "Minifying using YUICompressor"
	@$(SQUEEZE) yuicompressor --type=js $< > $@

script.u.js: script.js
	@echo "Minifying using UglifyJS"
	@$(UGLIFYJS) $< > $@

script.c.tmp.js: script.js
	@echo "Minifying using Google Closure"
	@$(SQUEEZE) closure --js $< --js_output_file $@

script.c.js: src/header.js script.c.tmp.js
	@cat src/header.js script.c.tmp.js > $@

clean:
	@-rm -f script.js script.min.js script.u.js script.c.tmp.js script.c.js
