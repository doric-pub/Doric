#!/usr/bin/env bash
##############################################################################
##
##  Publish JS,Android,iOS,Web
##
##############################################################################

CURRENT_DIR=$(cd $(dirname $0); pwd)
CURRENT_VERSION=$(cat $CURRENT_DIR/version)

echo "Current version is "$CURRENT_VERSION

# Modify

## JS
cd $CURRENT_DIR/doric-js && npm version $CURRENT_VERSION --allow-same-version

## Android
echo "version="$CURRENT_VERSION > $CURRENT_DIR/doric-android/version.properties

## iOS
sed -i "" "s/\(version[ ]*= \)'[0-9 \.]*'/\1'$CURRENT_VERSION'/g" $CURRENT_DIR/DoricCore.podspec

## Web
cd $CURRENT_DIR/doric-web && npm version $CURRENT_VERSION --allow-same-version

# git save
cd $CURRENT_DIR/

echo "Commit changes"
git add .

git commit -m "Publish version $CURRENT_VERSION"

git tag $CURRENT_VERSION

echo "Push Changes"

cd $CURRENT_DIR/doric-js && npm publish 
cd $CURRENT_DIR/doric-web && npm publish 
# cd $CURRENT_DIR/doric-android && ./gradlew clean publishAll 
cd $CURRENT_DIR && pod trunk push --allow-warnings