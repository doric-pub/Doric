#!/usr/bin/env bash
##############################################################################
##
##  Publish Android Legacy
##
##############################################################################

CURRENT_DIR=$(cd $(dirname $0); pwd)
CURRENT_VERSION=$(cat $CURRENT_DIR/version)

echo "Current version is "$CURRENT_VERSION

## Android
echo "version="$CURRENT_VERSION > $CURRENT_DIR/doric-android/version.properties

LATEST_HASH=$(git rev-parse origin/legacy/android_support)

git cherry-pick $LATEST_HASH

git tag "$CURRENT_VERSION"_legacy

echo "Publish Android"
cd $CURRENT_DIR/doric-android && ./gradlew clean publishAll