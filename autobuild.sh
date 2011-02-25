#!/bin/sh

# First forced build.
make

# Watch and build now.
watchmedo shell-command --patterns="*.js;*.coffee" --command="make" src/

