#!/usr/bin/env bash
##############################################################################
##
##  Package JS Bundles
##
##############################################################################
CURRENT_DIR=$(cd $(dirname $0); pwd)

cd $CURRENT_DIR/doric-js && npm run build

rm -rf $CURRENT_DIR/doric-Android/doric/src/main/assets/bundle/*.js
cp -rf $CURRENT_DIR/doric-js/bundle/*.js $CURRENT_DIR/doric-Android/doric/src/main/assets/bundle

rm -rf $CURRENT_DIR/doric-iOS/Pod/Assets/bundle/*.js
cp -rf $CURRENT_DIR/doric-js/bundle/*.js $CURRENT_DIR/doric-iOS/Pod/Assets/bundle

rm -rf $CURRENT_DIR/doric-iOS-framework/Assets/bundle/*.js
cp -rf $CURRENT_DIR/doric-js/bundle/*.js $CURRENT_DIR/doric-iOS-framework/Assets/bundle

cd $CURRENT_DIR/doric-demo && npm run build

rm -rf $CURRENT_DIR/doric-Android/app/src/main/assets/demo/*.js
cp -rf $CURRENT_DIR/doric-demo/bundle/src/*.js $CURRENT_DIR/doric-Android/app/src/main/assets/demo

rm -rf $CURRENT_DIR/doric-iOS/Example/Example/demo/*.js
cp -rf $CURRENT_DIR/doric-demo/bundle/src/*.js $CURRENT_DIR/doric-iOS/Example/Example/demo
