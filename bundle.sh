#!/usr/bin/env bash
##############################################################################
##
##  Package JS Bundles
##
##############################################################################
CURRENT_DIR=$(cd $(dirname $0); pwd)

cd $CURRENT_DIR/doric-js && npm run build
cd $CURRENT_DIR/doric-demo && npm run build
cd $CURRENT_DIR/doric-web && npm run build