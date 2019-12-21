#!/usr/bin/env bash
##############################################################################
##
##  Init Develop Environment
##
##############################################################################
cd doric-js && npm install && npm run build && cd ..
cd doric-demo && npm install && npm run build && cd ..
cd doric-cli && npm install && npm link && cd ..
