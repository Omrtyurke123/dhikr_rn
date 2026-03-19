import React, {useState, useEffect} from 'react';
import {
  View, Text, StyleSheet, Switch, TextInput,
  TouchableOpacity, ScrollView, Alert,
} from 'react-native';
import {Colors, Fonts, Spacing, Radius} from '../theme/colors';
import {getSettings, saveSettings} from '../services/StorageService';
import {AppSettings} from '../models/types';

const POPULAR_APPS = [
  {name: 'يوتيوب', package: 'com.google.android.youtube', icon: '▶️'},
  {name: 'إنستجرام', package: 'com.instagram.android', icon: '📸'},
  {name: 'تيك توك', package: 'com.zhiliaoapp.musically', icon: '🎵'},
  {name: 'تويتر/X', package: 'com.twitter.android', icon: '🐦'},
  {name: 'فيسبوك', package: 'com.facebook.katana', icon: '👍'},
  {name: 'سناب شات', package: 'com.snapchat.android', icon: '👻'},
  {name: 'واتساب', package: 'com.whatsapp', icon: '💬'},
  {name: 'تيليجرام', package: 'org.telegram.messenger', icon: '✈️'},
  {name: 'نتفليكس', package: 'com.netflix.mediaclient', icon: '🎬'},
  {name: 'كروم', package: 'com.android.chrome', icon: '🌐'},
];

export default function SettingsScreen() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [goalText, setGoalText] = useState('');

  useEffect(() => {
    getSettings().then(s => {
      setSettings(s);
      setGoalText(String(s.dailyGoal));
    });
  }, []);

  const update = async (partial: Partial<AppSettings>) => {
    if (!settings) return;
    const updated = {...settings, ...partial};
    setSettings(updated);
    await saveSettings(updated);
  };

  const toggleApp = (pkg: string) => {
    if (!settings) return;
    const locked = settings.lockedApps.includes(pkg)
      ? settings.lockedApps.filter(a => a !== pkg)
      : [...settings.lockedApps, pkg];
    update({lockedApps: locked});
  };

  const saveGoal = () => {
    const num = parseInt(goalText, 10);
    if (isNaN(num) || num <= 0) {
      Alert.alert('خطأ', 'أدخل رقماً صحيحاً');
      return;
    }
    update({dailyGoal: num});
    Alert.alert('✅', 'تم حفظ الهدف');
  };

  if (!settings) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Daily Goal */}
      <Text style={styles.sectionTitle}>🎯 الهدف اليومي</Text>
      <View style={styles.card}>
        <Text style={styles.label}>عدد الأذكار اليومية المطلوبة</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, {flex: 1}]}
            value={goalText}
            onChangeText={setGoalText}
            keyboardType="numeric"
            textAlign="right"
          />
          <TouchableOpacity style={styles.saveBtn} onPress={saveGoal}>
            <Text style={styles.saveBtnText}>حفظ</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Haptic */}
      <Text style={styles.sectionTitle}>📳 الاهتزاز</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.settingLabel}>تفعيل الاهتزاز عند التسبيح</Text>
          <Switch
            value={settings.hapticEnabled}
            onValueChange={v => update({hapticEnabled: v})}
            trackColor={{false: Colors.border, true: Colors.accent}}
            thumbColor={Colors.white}
          />
        </View>
      </View>

      {/* Notifications */}
      <Text style={styles.sectionTitle}>🔔 الإشعارات</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.settingLabel}>تفعيل الإشعارات</Text>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={v => update({notificationsEnabled: v})}
            trackColor={{false: Colors.border, true: Colors.accent}}
            thumbColor={Colors.white}
          />
        </View>
        {settings.notificationsEnabled && (
          <>
            <View style={styles.divider} />
            <Text style={styles.label}>وقت إشعار الصباح</Text>
            <TextInput
              style={styles.input}
              value={settings.morningNotifTime}
              onChangeText={v => update({morningNotifTime: v})}
              placeholder="07:00"
              placeholderTextColor={Colors.textSecondary}
              textAlign="right"
            />
            <Text style={styles.label}>وقت إشعار المساء</Text>
            <TextInput
              style={styles.input}
              value={settings.eveningNotifTime}
              onChangeText={v => update({eveningNotifTime: v})}
              placeholder="18:00"
              placeholderTextColor={Colors.textSecondary}
              textAlign="right"
            />
            <Text style={styles.label}>تذكير كل (ساعات)</Text>
            <TextInput
              style={styles.input}
              value={String(settings.periodicNotifHours)}
              onChangeText={v => update({periodicNotifHours: parseInt(v, 10) || 3})}
              keyboardType="numeric"
              textAlign="right"
            />
          </>
        )}
      </View>

      {/* App Lock */}
      <Text style={styles.sectionTitle}>🔒 قفل التطبيقات</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.settingLabel}>تفعيل قفل التطبيقات</Text>
          <Switch
            value={settings.lockEnabled}
            onValueChange={v => update({lockEnabled: v})}
            trackColor={{false: Colors.border, true: Colors.accent}}
            thumbColor={Colors.white}
          />
        </View>
        {settings.lockEnabled && (
          <>
            <View style={styles.divider} />
            <Text style={styles.label}>اختر التطبيقات المحظورة:</Text>
            {POPULAR_APPS.map(app => (
              <View key={app.package} style={styles.appRow}>
                <Text style={styles.appIcon}>{app.icon}</Text>
                <Text style={styles.appName}>{app.name}</Text>
                <Switch
                  value={settings.lockedApps.includes(app.package)}
                  onValueChange={() => toggleApp(app.package)}
                  trackColor={{false: Colors.border, true: Colors.accent}}
                  thumbColor={Colors.white}
                />
              </View>
            ))}
            <View style={styles.lockNote}>
              <Text style={styles.lockNoteText}>
                ⚠️ يجب تفعيل خدمة إمكانية الوصول من إعدادات الهاتف لتعمل هذه الخاصية
              </Text>
            </View>
          </>
        )}
      </View>

      <View style={{height: 40}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.bg},
  content: {padding: Spacing.md},
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: Fonts.size.md,
    fontWeight: 'bold',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    marginHorizontal: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    color: Colors.textPrimary,
    fontSize: Fonts.size.md,
    flex: 1,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: Fonts.size.sm,
    marginBottom: Spacing.xs,
    marginTop: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.bg,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    color: Colors.textPrimary,
    fontSize: Fonts.size.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xs,
  },
  saveBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    marginRight: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  saveBtnText: {color: Colors.white, fontWeight: 'bold'},
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  appIcon: {fontSize: 20, marginLeft: Spacing.sm},
  appName: {
    color: Colors.textPrimary,
    fontSize: Fonts.size.sm,
    flex: 1,
    marginHorizontal: Spacing.sm,
  },
  lockNote: {
    backgroundColor: Colors.bg,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.warning,
  },
  lockNoteText: {
    color: Colors.warning,
    fontSize: Fonts.size.xs,
    textAlign: 'center',
  },
});
