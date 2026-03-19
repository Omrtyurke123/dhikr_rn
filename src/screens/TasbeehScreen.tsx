import React from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Colors, Fonts, Spacing, Radius} from '../theme/colors';
import {AdhkarData} from '../data/adhkar';
import {DhikrItem} from '../models/types';
import {RootStackParamList} from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const allDhikr = AdhkarData.flatMap(c => c.adhkar).filter(d => d.count >= 10);

export default function TasbeehScreen() {
  const navigation = useNavigation<Nav>();

  const renderItem = ({item}: {item: DhikrItem}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('TasbeehCounter', {dhikrId: item.id})}
      activeOpacity={0.75}>
      <View style={styles.cardContent}>
        <Text style={styles.arabic}>{item.arabic}</Text>
        {item.source && (
          <Text style={styles.source}>📖 {item.source}</Text>
        )}
      </View>
      <View style={styles.countCircle}>
        <Text style={styles.countNum}>{item.count}</Text>
        <Text style={styles.countLabel}>مرة</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>التسبيح</Text>
        <Text style={styles.headerSub}>اختر ذكراً وابدأ</Text>
      </View>
      <FlatList
        data={allDhikr}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.bg},
  header: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
    backgroundColor: Colors.card,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: Fonts.size.xl,
    fontWeight: 'bold',
  },
  headerSub: {color: Colors.textSecondary, fontSize: Fonts.size.sm},
  list: {padding: Spacing.md},
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContent: {flex: 1, marginLeft: Spacing.sm},
  arabic: {
    color: Colors.textPrimary,
    fontSize: Fonts.size.md,
    lineHeight: 28,
    writingDirection: 'rtl',
    marginBottom: 4,
  },
  source: {color: Colors.textSecondary, fontSize: Fonts.size.xs},
  countCircle: {
    backgroundColor: Colors.accent,
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  countNum: {color: Colors.white, fontSize: Fonts.size.md, fontWeight: 'bold'},
  countLabel: {color: 'rgba(255,255,255,0.8)', fontSize: 10},
});
