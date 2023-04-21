#!/bin/bash

echo "rm -rf node_modules"
rm -rf node_modules
echo "rm -rf yarn.lock"
rm -rf yarn.lock
rm -rf package-lock.json

echo "rm -rf ~/Library/Caches/CocoaPods"
rm -rf ~/Library/Caches/CocoaPods
echo "rm -rf ios/Pods"
rm -rf ios/Pods
echo "rm -rf ~/Library/Developer/Xcode/DerivedData/*"
rm -rf ~/Library/Developer/Xcode/DerivedData/*

echo "rm -rf android/"
rm -rf android/

### RUN IOS
# cd ios
# echo "pod deintegrate"
# pod deintegrate
# echo "pod setup"
# pod setup
# echo "yarn"
# yarn
# echo "pod install"
# pod install

### RUN ANDROID
# echo "clean cache yarn"
# yarn clean cache
# echo "install yarn"
# yarn install
# echo "build to android"
# yarn build-android