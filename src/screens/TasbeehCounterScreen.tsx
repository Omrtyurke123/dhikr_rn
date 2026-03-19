import React, {useState, useRef} from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, StatusBar, Alert,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Colors, Fonts, Spacing, Radius} from '../theme/colors';
import {AdhkarData} from '../data/adhkar';
import {RootStackParamList} from '../navigation/AppNavigator';
import {incrementTodayCount, getSettings, updateStreak} from '../services/StorageService';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'TasbeehCounter'>;

const findDhikr = (id: string) => {
  for (const cat of AdhkarData) {
    const d = cat.adhkar.find(a => a.id === id);
    if (d) return d;
  }
  return null;
};

export default function TasbeehCounterScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const dhikr = findDhikr(route.params.dhikrId);

  const [count, setCount] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  React.useLayoutEffect(() => {
    if (dhikr) {
      navigation.setOptions({
        title: dhikr.meaning,
        headerRight: () => (
          <TouchableOpacity onPress={() => setCount(0)} style={{marginLeft: 8}}>
            <Text style={{color: Colors.accent, fontSize: Fonts.size.md}}>↺ إعادة</Text>
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, dhikr]);

  if (!dhikr) return null;

  const progress = Math.min(count / dhikr.count, 1);

  const handlePress = async () => {
    // Animation
    Animated.sequence([
      Animated.timing(scaleAnim, {toValue: 0.92, duration: 80, useNativeDriver: true}),
      Animated.timing(scaleAnim, {toValue: 1, duration: 80, useNativeDriver: true}),
    ]).start();

    const newCount = count + 1;
    setCount(newCount);

    // Update daily count
    const newTotal = await incrementTodayCount(1);

    // Check goal
    const settings = await getSettings();
    if (newTotal >= settings.dailyGoal) {
      await updateStreak(true);
    }

    // Check completion
    if (newCount >= dhikr.count) {
      setTimeout(() => {
        navigation.replace('Completion', {
          dhikrMeaning: dhikr.meaning,
          count: dhikr.count,
        });
      }, 300);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      {/* Progress Bar */}
      <View style={styles.progressBg}>
        <Animated.View style={[styles.progressFill, {width: `${progress * 100}%`}]} />
      </View>

      {/* Arabic Text */}
      <View style={styles.textContainer}>
        <Text style={styles.arabic}>{dhikr.arabic}</Text>
        {dhikr.source && (
          <Text style={styles.source}>📖 {dhikr.source}</Text>
        )}
      </View>

      {/* Counter Button */}
      <Animated.View style={[styles.btnWrapper, {transform: [{scale: scaleAnim}]}]}>
        <TouchableOpacity
          style={styles.counterBtn}
          onPress={handlePress}
          activeOpacity={1}>
          <Text style={styles.countNum}>{count}</Text>
          <Text style={styles.countOf}>من {dhikr.count}</Text>
        </TouchableOpacity>
      </Animated.View>

      <Text style={styles.hint}>اضغط للتسبيح</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
  },
  progressBg: {
    width: '100%',
    height: 6,
    backgroundColor: Colors.card,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  arabic: {
    color: Colors.textPrimary,
    fontSize: Fonts.size.xl,
    lineHeight: 40,
    textAlign: 'center',
    writingDirection: 'rtl',
    marginBottom: Spacing.sm,
  },
  source: {
    color: Colors.textSecondary,
    fontSize: Fonts.size.sm,
    textAlign: 'center',
  },
  btnWrapper: {
    marginBottom: Spacing.xxl,
  },
  counterBtn: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.accent,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  countNum: {
    color: Colors.white,
    fontSize: 64,
    fontWeight: 'bold',
    lineHeight: 72,
  },
  countOf: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: Fonts.size.sm,
  },
  hint: {
    color: Colors.textSecondary,
    fontSize: Fonts.size.sm,
    marginBottom: Spacing.xxl,
  },
});
