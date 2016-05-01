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

Store.dispatch(startApp());

AppRegistry.registerComponent('Snappshot', () => Root);
