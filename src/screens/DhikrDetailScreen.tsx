import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Colors, Fonts, Spacing, Radius} from '../theme/colors';
import {AdhkarData} from '../data/adhkar';
import {DhikrItem} from '../models/types';
import {RootStackParamList} from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'DhikrDetail'>;

export default function DhikrDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const category = AdhkarData.find(c => c.id === route.params.categoryId);

  if (!category) return null;

  React.useLayoutEffect(() => {
    navigation.setOptions({title: category.name});
  }, [navigation, category]);

  const renderItem = ({item}: {item: DhikrItem}) => (
    <View style={styles.card}>
      <Text style={styles.arabic}>{item.arabic}</Text>
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          {item.source && (
            <Text style={styles.source}>📖 {item.source}</Text>
          )}
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{item.count}×</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.startBtn}
        onPress={() => navigation.navigate('TasbeehCounter', {dhikrId: item.id})}
        activeOpacity={0.8}>
        <Text style={styles.startBtnText}>▶ ابدأ التسبيح</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={category.adhkar}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.bg},
  list: {padding: Spacing.md},
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  arabic: {
    color: Colors.textPrimary,
    fontSize: Fonts.size.lg,
    lineHeight: 36,
    textAlign: 'center',
    writingDirection: 'rtl',
    marginBottom: Spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  footerLeft: {flex: 1},
  source: {color: Colors.textSecondary, fontSize: Fonts.size.xs},
  countBadge: {
    backgroundColor: Colors.accentDim,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.accent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  countText: {color: Colors.accent, fontSize: Fonts.size.sm, fontWeight: 'bold'},
  startBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    alignItems: 'center',
  },
  startBtnText: {color: Colors.white, fontSize: Fonts.size.md, fontWeight: 'bold'},
});
