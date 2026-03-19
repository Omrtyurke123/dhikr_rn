import React, {useEffect, useState, useCallback} from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, StatusBar, ScrollView,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Colors, Fonts, Spacing, Radius} from '../theme/colors';
import {AdhkarData} from '../data/adhkar';
import {DhikrCategory} from '../models/types';
import {RootStackParamList} from '../navigation/AppNavigator';
import {
  getTodayCount, getStreak, checkStreakValidity, getSettings,
} from '../services/StorageService';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const [todayCount, setTodayCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(1000);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const count = await getTodayCount();
        setTodayCount(count);
        const s = await checkStreakValidity();
        setStreak(s.currentStreak);
        setLongestStreak(s.longestStreak);
        const settings = await getSettings();
        setDailyGoal(settings.dailyGoal);
      };
      load();
    }, []),
  );

  const progress = Math.min(todayCount / dailyGoal, 1);

  const renderCategory = ({item}: {item: DhikrCategory}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DhikrDetail', {categoryId: item.id})}
      activeOpacity={0.75}>
      <Text style={styles.cardIcon}>{item.icon}</Text>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSub}>{item.adhkar.length} أذكار</Text>
      </View>
      <Text style={styles.cardArrow}>‹</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>تطبيق الذكر</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Streak & Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>يوم متتالي</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>📿</Text>
            <Text style={styles.statValue}>{todayCount}</Text>
            <Text style={styles.statLabel}>اليوم</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🏆</Text>
            <Text style={styles.statValue}>{longestStreak}</Text>
            <Text style={styles.statLabel}>أطول streak</Text>
          </View>
        </View>

        {/* Daily Goal */}
        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalTitle}>الهدف اليومي</Text>
            <Text style={styles.goalCount}>
              {todayCount} / {dailyGoal}
            </Text>
          </View>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, {width: `${progress * 100}%`}]} />
          </View>
          {progress >= 1 && (
            <Text style={styles.goalComplete}>🎉 أحسنت! أكملت هدفك اليوم</Text>
          )}
        </View>

        {/* Categories */}
        <Text style={styles.sectionTitle}>الأذكار</Text>
        <FlatList
          data={AdhkarData}
          keyExtractor={item => item.id}
          renderItem={renderCategory}
          scrollEnabled={false}
        />
        <View style={{height: 20}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.bg},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: Fonts.size.xl,
    fontWeight: 'bold',
  },
  settingsIcon: {fontSize: 22},
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  statEmoji: {fontSize: 22, marginBottom: 4},
  statValue: {
    color: Colors.accent,
    fontSize: Fonts.size.xl,
    fontWeight: 'bold',
  },
  statLabel: {color: Colors.textSecondary, fontSize: Fonts.size.xs},
  goalCard: {
    backgroundColor: Colors.card,
    marginHorizontal: Spacing.md,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  goalTitle: {color: Colors.textPrimary, fontSize: Fonts.size.md, fontWeight: 'bold'},
  goalCount: {color: Colors.accent, fontSize: Fonts.size.md, fontWeight: 'bold'},
  progressBg: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
  },
  goalComplete: {
    color: Colors.accent,
    fontSize: Fonts.size.sm,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: Fonts.size.lg,
    fontWeight: 'bold',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.card,
    marginHorizontal: Spacing.md,
    marginVertical: 4,
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  cardIcon: {fontSize: 28, marginLeft: Spacing.sm},
  cardContent: {flex: 1, marginHorizontal: Spacing.md},
  cardTitle: {
    color: Colors.textPrimary,
    fontSize: Fonts.size.md,
    fontWeight: 'bold',
  },
  cardSub: {color: Colors.textSecondary, fontSize: Fonts.size.sm, marginTop: 2},
  cardArrow: {color: Colors.accent, fontSize: 20, transform: [{rotate: '180deg'}]},
});
