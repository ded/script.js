# $script.js
# ==========
# A fork of http://github.com/polvero/script.js
#
# Optimization Notes
# ------------------
# Optimize for compression and only then minification.
# This will produce smaller scripts. The more variables
# you add to the function preamble, the less effective
# compression will become. Strategy:
#
# 1. Boolean values:
#    Use `1` and `0` instead of `true` and `false` respectively.
#    (Wish we had a preprocessor that did this automatically, but not yet.)
#
# 2. Limit the scope of all the variables as much as possible
#    using closures.
#
# 3. Use the `each` and `all` functions.
#
# 4. Reuse the same variable name as much as possible while
#    not blowing up scope. Keep scopes limited using closures.
#
# 5. Avoid using named functions which would otherwise result
#    in function hoisting and polluting the global namespace.
#
# 6. `document.readyState` is the same as `document["readyState"]`. The former
#    uses fewer characters and will compress *better*. Don't assign
#    string literals to new variables. Every variable added increases
#    compressed size.
#
# 7. Inline string literals (Wish we had a preprocessor built
#    into coffee-script for this. We could have used macro expansion
#    to achieve this.)
#
# 8. Use only one type of string quoting character. Either `"` or `'`,
#    but not both. The minifiers are smart enough to handle this for
#    you, but you should know about this.
#
# 9. Avoid unnecessary nesting using closures. They don't add much
#    value to the code and make it harder to read it.
#
# 10. If you're going to include a hack, *document it* and provide
#     links to articles about where one can find more information
#     if required.
#
# 11. **DON'T** try to minify code yourself. Optimize for compression.
#     The minifier knows its job very well.
#
# 12. Use legible variable names. The minifier will take
#     care of shortening them for you.

#### License header
###! $script.js http://goo.gl/x6CM3
(C) 2011 Dustin Diaz, Jacob Thornton, Yesudeep Mangalapilly
CC Attribution License: http://goo.gl/YMnSv###
window.$script = ((window, document, timeout) ->
    # All the IDs processed
    scriptIds             = {}
    # All the script urls processed.
    scriptUrls            = {}
    list                  = {}
    delay                 = {}
    # **REMOVED**: Regular expression to match against `document.readyState`. Looks for the substring `"in"` in `"loading"`.
    # domReadyLoadingRegexp = /in/

    # Handle to the first script element in the document.
    firstScriptElement    = document.getElementsByTagName("script")[0]

    #### Adds the `js` class to the `html` element to help CSS authors.
    # 
    #     hasClass = (element, className) ->
    #         return (" #{element.className} ").indexOf(className) > -1
    #
    #     addClass = (element, className) ->
    #         element.className = if hasClass(element, className) then element.className else element.className + " " + className 
    #
    #     addClass(document.documentElement, 'js')
    # 
    # As `$script.js` is loaded right in the head of the document, 
    # we assume no `js` class has been set and we just add it.
    document.documentElement.className += ' js'

    # Returns **truthy** if all elements in the array pass the test function;
    # **falsy** otherwise.
    # We delegate to the JavaScript 1.6 `Array.every` method if it is
    # available.
    all = Array.every or (array, iterator) ->
        for element, i in array
            if not iterator(element, i, array)
                return 0 # false
        return 1 # true

    # Yet another `each`.
    each = (array, test_function) ->
        all(array, (element, i) -> not test_function(element, i, array))
        return

    #### Missing `document.readyState` Workaround
    # Some browsers (e.g. [< Firefox 3.6](https://developer.mozilla.org/en/dom/document.readystate))
    # don't have `document.readyState` implemented.
    # The closure limits the scope of `fn`.
    not document.readyState and document.addEventListener and (() ->
            fn = () ->
                document.removeEventListener("DOMContentLoaded", fn, 0) # false)
                document.readyState = "complete"
                return
            document.addEventListener("DOMContentLoaded", fn, 0) # false)
            # We don't need "loading" either, since we're now only looking for "complete" or loaded.
            # document.readyState = "loading"
            return
        )()

    #### The global `$script` object.
    #
    # **@param `urls`**
    #   A URL to the script or a list of URLs to scripts that
    #   will be fetched asynchronously.
    #
    # **@param `idOrFnDone`**
    #   Either a `String` literal giving this group of URLs
    #   a name or a `Function` callback that will be called
    #   when the scripts specified in `urls` are fetched.
    #
    # **@param `optFnDone`**
    #   If a `String` literal identifier was specified for 
    #   the `idOrFnDone` parameter, this parameter can be 
    #   used to specify the callback that will be called
    #   when the scripts specified in `urls` are fetched. 
    $script = (urls, idOrFnDone, optFnDone) ->
        # We need `urls` to be a sequence.
        urls = if urls.push then urls else [urls]
        queue = urls.length
        # If a function was passed in as the argument
        # `idOrFnDone` to `$script`, we make up an identifier
        # and set the callback to this function.
        if idOrFnDone.call
            done = idOrFnDone
            id   = urls.join("")
        # Otherwise, we use the `optFnDone` argument
        # as our callback function and use the identifier
        # specified.
        else
            done = optFnDone
            id   = idOrFnDone

        # Don't fetch scripts for the given id again.
        if scriptIds[id]
            return

        timeout(() ->
            # If `item` is a function, call it, othewise, it is a key into the `list` dictionary.
            fn = (item) -> if item.call then item() else list[item]

            # `for url in urls ...` produces larger compressed code. Using `each` instead.
            each(urls, (url) ->
                # Don't fetch the same script url again.
                if scriptUrls[url]
                    return

                scriptUrls[url] = scriptIds[id] = 1 # true
                element = document.createElement("script")
                loaded  = 0 # false

                element.onload = element.onreadystatechange = () ->
                    # We don't need the regular expression:
                    #
                    #     if (element.readyState and not (not domReadyLoadingRegexp.test(element.readyState))) or loaded
                    # 
                    # to:
                    #
                    #      if (element.readyState and element.readyState == "loading") or loaded
                    #
                    # And getting rid of "loading" entirely from the code (one less string to worry about):
                    #
                    if (element.readyState and element.readyState isnt "complete") or loaded
                        return
                    element.onload = element.onreadystatechange = null
                    loaded         = 1 # true

                    # The original callback() inlined.
                    if not --queue
                        list[id] = true
                        done and done()
                        for dset of delay
                            all(dset.split("|"), fn) and not each(delay[dset], fn) and (delay[dset] = [])
                    return
                element.async = 1 # true
                element.src   = url
                firstScriptElement.parentNode.insertBefore(element, firstScriptElement)

                return
            )
            return
        , 0)

        # Allows chaining calls.
        return $script

    $script.ready = (deps, ready, req) ->
        # We need `deps` to be a sequence.
        deps = if deps.push then deps else [deps]
        missing = []

        if not each(deps, (dep) -> (list[dep] or missing.push(dep))) and all(deps, (dep) -> list[dep])
            ready()
        else
            key = deps.join("|")
            delay[key] or= []
            delay[key].push(ready)
            req and req(missing)

        # Allow chaining calls.
        return $script

    #### The shortest `domReady` hack there is.
    $script.domReady = (fn) ->
        # **Manual minification**:
        # Coffee-script doesn't do this automatically, so we're inlining the JavaScript
        # code for the following in here.
        #
        #     if domReadyLoadingRegexp.test(document.readyState)
        #         timeout(() ->
        #             $script.domReady(fn)
        #             return
        #         , 50)
        #     else
        #         fn()
        # to:
        #
        #     `domReadyLoadingRegexp.test(document.readyState) ? timeout(function() { $script.domReady(fn); }, 50) : fn();`
        #
        # Turns out, we don't need the regular expression either. Therefore:
        #
        #     `document.readyState === "loading" ? timeout(function() {$script.domReady(fn); }, 50): fn();`
        #
        # But wait, we can do better. Just get rid of the "loading" string from the entire code and we hit lower size.
        # Why 20 ms and not 50ms? http://davidwalsh.name/mootools-domready
        `document.readyState === "complete" ? fn(): timeout(function() {$script.domReady(fn); }, 20);`
        return

    return $script
)(this, document, setTimeout)
