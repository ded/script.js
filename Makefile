# Install these:
#     pip install squeeze
#     pip install Pygments==dev
# Install nodejs and npm
# Install these:
#     npm install docco
SQUEEZE=squeeze
UGLIFYJS=uglifyjs

.PHONY: all clean

all: script.min.js script.u.js script.c.js

script.min.js: script.js
	@echo "Minifying using YUICompressor"
	@$(SQUEEZE) yuicompressor --type=js $< > $@

script.u.js: script.js
	@echo "Minifying using UglifyJS"
	@$(UGLIFYJS) $< > $@

script.c.tmp.js: script.js
	@echo "Minifying using Google Closure"
	@$(SQUEEZE) closure --js $< --js_output_file $@

script.c.js: script.c.tmp.js
	@cat header.js $< > $@

clean:
	@-rm -rf script.u.js script.c.tmp.js script.c.js
