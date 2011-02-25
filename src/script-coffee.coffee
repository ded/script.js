###! $script.js v1.1
https://github.com/polvero/script.js
Copyright: @ded & @fat - Dustin Diaz, Jacob Thornton 2011
License: CC Attribution: http://creativecommons.org/licenses/by/3.0/###

# Optimize for GZip not only for the minification.
# GZip is available on 80% of the browsers. Only
# minification would cater to the remaining 20%.

((global, doc, timeout) ->    
    # All the IDs processed
    script_ids = {}
    # All the script paths processed.
    script_paths = {}
    list = {}
    delay = {}    
    re = /in/
    first_script = doc.getElementsByTagName("script")[0]

    all = Array.every or (array, fn) ->
        for element, i in array
            if not fn(element, i, array)
                return false
        return true
    
    each = (array, fn) ->
        all(array, (element, i) -> not fn(element, i, array))
        return
    
    (() ->
        # Closure to limit the scope of `fn`
        if not doc.readyState and doc.addEventListener
            fn = () ->
                doc.removeEventListener("DOMContentLoaded", fn, false)
                doc.readyState = "complete"
                return
            doc.addEventListener("DOMContentLoaded", fn, false)
            doc.readyState = "loading"
            return
    )()
    
    global.$script = (paths, idOrDone, optDone) ->
        paths = if paths.push then paths else [paths]
        queue = paths.length
        if idOrDone.call
            done = idOrDone
            id = paths.join("")
        else
            done = optDone
            id = idOrDone

        # Don't fetch scripts for the given id again.
        if script_ids[id]
            return

        timeout(() ->
            fn = (item) -> if item.call then item() else list[item]
            #for path in paths
            each(paths, (path) ->
                # Don't fetch the same script path again.
                if script_paths[path]
                    return
                    
                script_paths[path] = script_ids[id] = true
                element = doc.createElement("script")
                loaded = false

                element.onload = element.onreadystatechange = () ->
                    if (element.readyState and not (not re.test(element.readyState))) or loaded
                        return
                    element.onload = element.onreadystatechange = null
                    loaded = true
                    
                    # The original callback() inlined.
                    if not --queue
                        list[id] = true
                        done and done()
                        for dset of delay
                            all(dset.split("|"), fn) and not each(delay[dset], fn) and (delay[dset] = [])
                    return
                element.async = true
                element.src = path
                first_script.parentNode.insertBefore(element, first_script)
            
                return
            )
            return
        , 0)

        # Allows chaining calls.
        return $script
    
    $script.ready = (deps, ready, req) ->
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
    
    global.$script.domReady = (fn) ->
        if re.test(doc.readyState)
            timeout(() -> 
                global.$script.domReady(fn)
                return
            , 50) 
        else 
            fn()
        return
        
    return
)(this, document, setTimeout)    