import React, {useState, useCallback} from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Alert,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Colors, Fonts, Spacing, Radius} from '../theme/colors';
import {DailyChallenge} from '../models/types';
import {getChallenges, deleteChallenge} from '../services/StorageService';
import {RootStackParamList} from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ChallengesScreen() {
  const navigation = useNavigation<Nav>();
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);

  useFocusEffect(
    useCallback(() => {
      getChallenges().then(setChallenges);
    }, []),
  );

  const handleDelete = (id: string) => {
    Alert.alert('حذف التحدي', 'هل أنت متأكد؟', [
      {text: 'إلغاء', style: 'cancel'},
      {
        text: 'حذف',
        style: 'destructive',
        onPress: async () => {
          await deleteChallenge(id);
          setChallenges(prev => prev.filter(c => c.id !== id));
        },
      },
    ]);
  };

  const renderChallenge = ({item}: {item: DailyChallenge}) => {
    const progress = Math.min(item.currentCount / item.targetCount, 1);
    return (
      <View style={[styles.card, item.isCompleted && styles.cardCompleted]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardName}>{item.name}</Text>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Text style={styles.deleteBtn}>🗑</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.dhikrText} numberOfLines={2}>{item.dhikrText}</Text>
        <View style={styles.progressRow}>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, {width: `${progress * 100}%`}]} />
          </View>
          <Text style={styles.progressText}>
            {item.currentCount}/{item.targetCount}
          </Text>
        </View>
        {item.isCompleted && (
          <Text style={styles.completedBadge}>✅ مكتمل</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>التحديات</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('ChallengeSetup')}>
          <Text style={styles.addBtnText}>+ تحدي جديد</Text>
        </TouchableOpacity>
      </View>

      {challenges.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🎯</Text>
          <Text style={styles.emptyText}>لا يوجد تحديات</Text>
          <Text style={styles.emptySub}>اضغط "تحدي جديد" لإضافة تحدي يومي</Text>
        </View>
      ) : (
        <FlatList
          data={challenges}
          keyExtractor={i => i.id}
          renderItem={renderChallenge}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.bg},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
    backgroundColor: Colors.card,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: Fonts.size.xl,
    fontWeight: 'bold',
  },
  addBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  addBtnText: {color: Colors.white, fontSize: Fonts.size.sm, fontWeight: 'bold'},
  list: {padding: Spacing.md},
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  cardCompleted: {
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  cardName: {
    color: Colors.textPrimary,
    fontSize: Fonts.size.md,
    fontWeight: 'bold',
  },
  deleteBtn: {fontSize: 18},
  dhikrText: {
    color: Colors.textSecondary,
    fontSize: Fonts.size.sm,
    marginBottom: Spacing.sm,
    writingDirection: 'rtl',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  progressBg: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
  },
  progressText: {
    color: Colors.accent,
    fontSize: Fonts.size.sm,
    fontWeight: 'bold',
    minWidth: 50,
    textAlign: 'right',
  },
  completedBadge: {
    color: Colors.accent,
    fontSize: Fonts.size.sm,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  emptyEmoji: {fontSize: 60, marginBottom: Spacing.md},
  emptyText: {
    color: Colors.textPrimary,
    fontSize: Fonts.size.lg,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  emptySub: {
    color: Colors.textSecondary,
    fontSize: Fonts.size.sm,
    textAlign: 'center',
  },
});
