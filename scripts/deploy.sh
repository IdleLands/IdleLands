#!/bin/bash
set -e # Exit with nonzero exit code if anything fails

SOURCE_BRANCH="master"
TARGET_BRANCH="heroku-dist"

function doCompile {
  npm run build:server
}

mkdir dist

# Pull requests and commits to other branches shouldn't try to deploy, just build to verify
# if [ "$TRAVIS_PULL_REQUEST" != "false" -o "$TRAVIS_BRANCH" != "$SOURCE_BRANCH" -o "$TRAVIS_BRANCH" != "v*" ]; then
#     echo "Skipping deploy; just doing a build."
#     doCompile
#     exit 0
# fi

# Save some useful information
SHA=`git rev-parse --verify HEAD`

# Clone the existing gh-pages for this repo into out/
# Create a new empty branch if gh-pages doesn't exist yet (should only happen on first deply)
git checkout $TARGET_BRANCH || git checkout --orphan $TARGET_BRANCH

# Clean out existing contents
rm -rf dist/**/* || exit 0

chmod a+x ./scripts/deploy.sh

# Run our compile script
doCompile

# Now let's go have some fun with the cloned repo
git config user.name "Travis CI"
git config user.email "travis@travis-ci.org"

# If there are no changes to the compiled out (e.g. this is a README update) then just bail.
# if [ -z `git diff --exit-code` ]; then
#    echo "No changes to the output on this push; exiting."
#    exit 0
# fi

rm -rf .babelrc .editorconfig .eslintignore .eslintrc .gitignore .travis.yml LICENSE README.md
rm -rf docs scripts src test node_modules assets

git remote add origin-heroku https://${GH_TOKEN}@github.com/IdleLands/IdleLands.git > /dev/null 2>&1

# Commit the "changes", i.e. the new version.
# The delta will show diffs between new and old versions.
git add --all .

git commit -m "Deploy to GitHub/Heroku: ${SHA}"

# Now that we're all set up, we can push.
git push --force --set-upstream origin-heroku $TARGET_BRANCH