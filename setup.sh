#!/usr/bin/env bash
##############################################################################
##
##  Init Develop Environment
##
##############################################################################

cd js-framework && npm install && npm run build && cd ..
cd debugger && npm install && npm run build && cd ..
cd demo && npm install && npm run build && cd ..
cd doric-cli && npm install && cd ..
