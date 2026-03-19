import React, {useState} from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, FlatList, Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Colors, Fonts, Spacing, Radius} from '../theme/colors';
import {AdhkarData} from '../data/adhkar';
import {DhikrItem} from '../models/types';
import {addChallenge} from '../services/StorageService';

const allDhikr = AdhkarData.flatMap(c => c.adhkar);

export default function ChallengeSetupScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [selectedDhikr, setSelectedDhikr] = useState<DhikrItem | null>(null);
  const [target, setTarget] = useState('100');

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('تنبيه', 'أدخل اسم التحدي');
      return;
    }
    if (!selectedDhikr) {
      Alert.alert('تنبيه', 'اختر ذكراً');
      return;
    }
    const targetNum = parseInt(target, 10);
    if (isNaN(targetNum) || targetNum <= 0) {
      Alert.alert('تنبيه', 'أدخل عدداً صحيحاً');
      return;
    }

    await addChallenge({
      id: Date.now().toString(),
      name: name.trim(),
      dhikrId: selectedDhikr.id,
      dhikrText: selectedDhikr.arabic,
      targetCount: targetNum,
      currentCount: 0,
      createdAt: new Date().toISOString(),
      isCompleted: false,
    });

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>اسم التحدي</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="مثال: استغفار اليوم"
          placeholderTextColor={Colors.textSecondary}
          textAlign="right"
        />

        <Text style={styles.label}>العدد المطلوب</Text>
        <TextInput
          style={styles.input}
          value={target}
          onChangeText={setTarget}
          keyboardType="numeric"
          textAlign="right"
        />

        <Text style={styles.label}>اختر الذكر</Text>
      </View>

      <FlatList
        data={allDhikr}
        keyExtractor={i => i.id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[
              styles.dhikrItem,
              selectedDhikr?.id === item.id && styles.dhikrSelected,
            ]}
            onPress={() => setSelectedDhikr(item)}>
            <Text style={styles.dhikrText} numberOfLines={2}>{item.arabic}</Text>
          </TouchableOpacity>
        )}
        style={styles.list}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
        <Text style={styles.saveBtnText}>حفظ التحدي</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.bg},
  form: {padding: Spacing.lg},
  label: {
    color: Colors.textSecondary,
    fontSize: Fonts.size.sm,
    marginBottom: Spacing.xs,
    marginTop: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: Radius.sm,
    padding: Spacing.md,
    color: Colors.textPrimary,
    fontSize: Fonts.size.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  list: {flex: 1, paddingHorizontal: Spacing.lg},
  dhikrItem: {
    backgroundColor: Colors.card,
    borderRadius: Radius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dhikrSelected: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accentDim,
  },
  dhikrText: {
    color: Colors.textPrimary,
    fontSize: Fonts.size.sm,
    writingDirection: 'rtl',
    lineHeight: 22,
  },
  saveBtn: {
    backgroundColor: Colors.accent,
    margin: Spacing.lg,
    borderRadius: Radius.full,
    padding: Spacing.md,
    alignItems: 'center',
  },
  saveBtnText: {color: Colors.white, fontSize: Fonts.size.lg, fontWeight: 'bold'},
});
