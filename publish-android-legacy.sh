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

# get repo name from git
remote=$(git config --get remote.origin.url)
repo=$(basename $remote .git)

commit=$(git rev-parse HEAD)

curl -s -X POST https://api.github.com/repos/doric-pub/$repo/git/refs \
-H "Authorization: token $GITHUB_TOKEN" \
-d @- << EOF
{
  "ref": "refs/tags/${CURRENT_VERSION}_legacy",
  "sha": "$commit"
}
EOF