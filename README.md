# Snappshot

## To install
Xcode (for ios app)
Android studio (for Android)
Node
Npm
Mongodb
Mongod

## Dev Setup
### start the local datastore server
The following command assumes you put mongod in your $PATH shell variable
$ mongod

### run the app server
$ npm install
$ npm start

### run the tests
(TODO)

### run the ios app
(install Xcode for mac)
$ open /mobile/ios/Snappshot.xcodeproj
click build in Xcode

### run android app
With an emulator running
$ react-native run-android

### run the webapp client
(TODO)

## Deployment
### ios app
Set server to prod location on index.ios.js
Set jsCodeLocation to be the pre-built bundle in AppDelegate.m
Bump up build number in Xcode
Archive and upload
Update via internal test flight and test changes
Select the new build for external testing
Commit/push the version bump

### android app
(TODO)

### backend server
(TODO)

### web client
(TODO)
