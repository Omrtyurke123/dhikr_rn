import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {StatusBar} from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import {Colors} from './src/theme/colors';

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />
      <AppNavigator />
    </NavigationContainer>
  );
}
