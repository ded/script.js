# Install these:
#     pip install squeeze
#     pip install Pygments==dev
# Install nodejs and npm
# Install these:
#     npm install docco
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
