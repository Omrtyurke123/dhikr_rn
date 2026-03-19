import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Colors, Fonts, Spacing, Radius} from '../theme/colors';
import {RootStackParamList} from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'Completion'>;

export default function CompletionScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const {dhikrMeaning, count} = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🎉</Text>
      <Text style={styles.title}>أحسنت!</Text>
      <Text style={styles.subtitle}>أتممت {count} مرة</Text>
      <Text style={styles.meaning}>{dhikrMeaning}</Text>

      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={() => navigation.navigate('MainTabs')}
        activeOpacity={0.8}>
        <Text style={styles.primaryBtnText}>العودة للرئيسية</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryBtn}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}>
        <Text style={styles.secondaryBtnText}>تكرار الذكر</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  emoji: {fontSize: 80, marginBottom: Spacing.lg},
  title: {
    color: Colors.accent,
    fontSize: Fonts.size.xxxl,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    color: Colors.textPrimary,
    fontSize: Fonts.size.xl,
    marginBottom: Spacing.sm,
  },
  meaning: {
    color: Colors.textSecondary,
    fontSize: Fonts.size.md,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  primaryBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
    width: '100%',
    alignItems: 'center',
  },
  primaryBtnText: {color: Colors.white, fontSize: Fonts.size.lg, fontWeight: 'bold'},
  secondaryBtn: {
    paddingVertical: Spacing.sm,
  },
  secondaryBtnText: {color: Colors.textSecondary, fontSize: Fonts.size.md},
});
