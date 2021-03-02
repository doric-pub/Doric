#!/usr/bin/env bash
##############################################################################
##
##  Init Develop Environment
##
##############################################################################
CURRENT_DIR=$(cd $(dirname $0); pwd)

cd $CURRENT_DIR/doric-js && npm install && npm run build
cd $CURRENT_DIR/doric-cli && npm install && npm link
cd $CURRENT_DIR/doric-demo && npm install && npm run build
cd $CURRENT_DIR/doric-web && npm install && npm run build
