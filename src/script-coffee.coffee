###! $script.js v1.1
https://github.com/polvero/script.js
Copyright: @ded & @fat - Dustin Diaz, Jacob Thornton 2011
License: CC Attribution: http://creativecommons.org/licenses/by/3.0/###

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

# Here we go
# ----------
((global, timeout) ->
    # All the IDs processed
    scriptIds             = {}
    # All the script paths processed.
    scriptPaths           = {}
    list                  = {}
    delay                 = {}
    # **REMOVED**: Regular expression to match against `document.readyState`. Looks for the substring `"in"` in `"loading"`.
    # domReadyLoadingRegexp = /in/

    # Handle to the first script element in the document.
    firstScriptElement    = document.getElementsByTagName("script")[0]

    # Returns **truthy** if all elements in the array pass the test function;
    # **falsy** otherwise.
    # We delegate to the JavaScript 1.6 `Array.every` method if it is
    # available.
    all = Array.every or (array, fn) ->
        for element, i in array
            if not fn(element, i, array)
                return 0 # false
        return 1 # true

    # Yet another `each`.
    each = (array, fn) ->
        all(array, (element, i) -> not fn(element, i, array))
        return

    #### Missing `document.readyState` Workaround
    # Some browsers (e.g. [< Firefox 3.6](https://developer.mozilla.org/en/dom/document.readystate))
    # don't have `document.readyState` implemented.
    # The closure exists to limit the scope of `fn`.
    (() ->
        if not document.readyState and document.addEventListener
            fn = () ->
                document.removeEventListener("DOMContentLoaded", fn, 0) # false)
                document.readyState = "complete"
                return
            document.addEventListener("DOMContentLoaded", fn, 0) # false)
            # We don't need "loading" either, since we're now only looking for "complete" or loaded.
            # document.readyState = "loading"
            return
    )()

    global.$script = (paths, idOrDone, optDone) ->
        # We need `paths` to be a sequence.
        paths = if paths.push then paths else [paths]
        queue = paths.length
        if idOrDone.call
            done = idOrDone
            id   = paths.join("")
        else
            done = optDone
            id   = idOrDone

        # Don't fetch scripts for the given id again.
        if scriptIds[id]
            return

        timeout(() ->
            fn = (item) -> if item.call then item() else list[item]

            # `for path in paths ...` produces larger compressed code. Using `each` instead.
            each(paths, (path) ->
                # Don't fetch the same script path again.
                if scriptPaths[path]
                    return

                scriptPaths[path] = scriptIds[id] = 1 # true
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
                    if (element.readyState and element.readyState != "complete") or loaded
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
                element.src   = path
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
            delay[key] = delay[key] or []
            delay[key].push(ready)
            req and req(missing)

        # Allow chaining calls.
        return $script

    # The shortest `domReady` hack there is.
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
        #
        `document.readyState === "complete" ? fn(): timeout(function() {$script.domReady(fn); }, 50);`
        return

    return
)(this, setTimeout)
