import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Text} from 'react-native';
import {Colors} from '../theme/colors';

import HomeScreen from '../screens/HomeScreen';
import TasbeehScreen from '../screens/TasbeehScreen';
import ChallengesScreen from '../screens/ChallengesScreen';
import DhikrDetailScreen from '../screens/DhikrDetailScreen';
import TasbeehCounterScreen from '../screens/TasbeehCounterScreen';
import CompletionScreen from '../screens/CompletionScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ChallengeSetupScreen from '../screens/ChallengeSetupScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  DhikrDetail: {categoryId: string};
  TasbeehCounter: {dhikrId: string};
  Completion: {dhikrMeaning: string; count: number};
  Settings: undefined;
  ChallengeSetup: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

const TabIcon = ({emoji, focused}: {emoji: string; focused: boolean}) => (
  <Text style={{fontSize: focused ? 22 : 18, opacity: focused ? 1 : 0.6}}>
    {emoji}
  </Text>
);

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.card,
          borderTopColor: Colors.border,
          paddingBottom: 8,
          paddingTop: 6,
          height: 60,
        },
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarLabelStyle: {fontSize: 12},
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'الرئيسية',
          tabBarIcon: ({focused}) => <TabIcon emoji="🏠" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Tasbeeh"
        component={TasbeehScreen}
        options={{
          tabBarLabel: 'التسبيح',
          tabBarIcon: ({focused}) => <TabIcon emoji="📿" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Challenges"
        component={ChallengesScreen}
        options={{
          tabBarLabel: 'التحديات',
          tabBarIcon: ({focused}) => <TabIcon emoji="🏆" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: Colors.bg},
        headerTintColor: Colors.textPrimary,
        headerTitleStyle: {fontSize: 18},
        contentStyle: {backgroundColor: Colors.bg},
      }}>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DhikrDetail"
        component={DhikrDetailScreen}
        options={{title: 'الأذكار'}}
      />
      <Stack.Screen
        name="TasbeehCounter"
        component={TasbeehCounterScreen}
        options={{title: 'التسبيح'}}
      />
      <Stack.Screen
        name="Completion"
        component={CompletionScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{title: 'الإعدادات'}}
      />
      <Stack.Screen
        name="ChallengeSetup"
        component={ChallengeSetupScreen}
        options={{title: 'تحدي جديد'}}
      />
    </Stack.Navigator>
  );
}
