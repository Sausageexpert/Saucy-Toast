
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import SearchScreen from './Screens/SearchScreen';
import TransactionScreen from './Screens/TransactionScreen';
import AuthenticationScreen from './Screens/AuthenticationScreen';
//import SpecialScreen from './Screens/SpecialScreen';

export default class App extends React.Component{
  // Wow this theme is AWESOME!!! Horizon-Bold
  render(){
    return <AppContainer/>
  }
  
}

// Crime Scene: Do Not Cross. Detective Faylene ma'am is on the case
// All clues must be left undisturbed
// This criminal is a slippery character. I doubt it will be easy to catch him/her

const TabNavigator = createBottomTabNavigator({
  SearchScreen: SearchScreen,
  TransactionScreen: TransactionScreen
});

const radar = createSwitchNavigator({
  LoginScreen: {screen: AuthenticationScreen},
  MainScreen: {screen: TabNavigator}
});

const AppContainer = createAppContainer(radar);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'purple',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
