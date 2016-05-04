/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { AppRegistry } from 'react-native';
import Root from './js/Root';
import { startApp } from './js/Actions/ActionCreator';
import Store from './js/Store/Store';

let unsubscribe = Store.subscribe(() =>
  console.log('App store state: ', Store.getState())
);

console.log('app state before action STARTED', Store.getState());
Store.dispatch(startApp());

console.log('app state after action STARTED', Store.getState());
AppRegistry.registerComponent('Snappshot', () => Root);
