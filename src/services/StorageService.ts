import AsyncStorage from '@react-native-async-storage/async-storage';
import {DailyChallenge, AppSettings, StreakData, DailyStats} from '../models/types';

const KEYS = {
  CHALLENGES: 'challenges',
  SETTINGS: 'settings',
  STREAK: 'streak',
  DAILY_STATS: 'daily_stats',
  TODAY_COUNT: 'today_count',
  TODAY_DATE: 'today_date',
};

const DEFAULT_SETTINGS: AppSettings = {
  dailyGoal: 1000,
  hapticEnabled: true,
  notificationsEnabled: false,
  morningNotifTime: '07:00',
  eveningNotifTime: '18:00',
  periodicNotifHours: 3,
  lockEnabled: false,
  lockedApps: [],
};

const DEFAULT_STREAK: StreakData = {
  currentStreak: 0,
  lastCompletedDate: '',
  longestStreak: 0,
};

// ===== Challenges =====
export const getChallenges = async (): Promise<DailyChallenge[]> => {
  const json = await AsyncStorage.getItem(KEYS.CHALLENGES);
  return json ? JSON.parse(json) : [];
};

export const saveChallenges = async (challenges: DailyChallenge[]): Promise<void> => {
  await AsyncStorage.setItem(KEYS.CHALLENGES, JSON.stringify(challenges));
};

export const addChallenge = async (challenge: DailyChallenge): Promise<void> => {
  const challenges = await getChallenges();
  challenges.push(challenge);
  await saveChallenges(challenges);
};

export const updateChallenge = async (updated: DailyChallenge): Promise<void> => {
  const challenges = await getChallenges();
  const idx = challenges.findIndex(c => c.id === updated.id);
  if (idx !== -1) {
    challenges[idx] = updated;
    await saveChallenges(challenges);
  }
};

export const deleteChallenge = async (id: string): Promise<void> => {
  const challenges = await getChallenges();
  await saveChallenges(challenges.filter(c => c.id !== id));
};

// ===== Settings =====
export const getSettings = async (): Promise<AppSettings> => {
  const json = await AsyncStorage.getItem(KEYS.SETTINGS);
  return json ? {...DEFAULT_SETTINGS, ...JSON.parse(json)} : DEFAULT_SETTINGS;
};

export const saveSettings = async (settings: AppSettings): Promise<void> => {
  await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
};

// ===== Daily Stats & Today Count =====
export const getTodayCount = async (): Promise<number> => {
  const savedDate = await AsyncStorage.getItem(KEYS.TODAY_DATE);
  const today = new Date().toDateString();
  if (savedDate !== today) {
    await AsyncStorage.setItem(KEYS.TODAY_DATE, today);
    await AsyncStorage.setItem(KEYS.TODAY_COUNT, '0');
    return 0;
  }
  const count = await AsyncStorage.getItem(KEYS.TODAY_COUNT);
  return count ? parseInt(count, 10) : 0;
};

export const incrementTodayCount = async (amount: number = 1): Promise<number> => {
  const current = await getTodayCount();
  const newCount = current + amount;
  await AsyncStorage.setItem(KEYS.TODAY_COUNT, String(newCount));
  return newCount;
};

// ===== Streak =====
export const getStreak = async (): Promise<StreakData> => {
  const json = await AsyncStorage.getItem(KEYS.STREAK);
  return json ? JSON.parse(json) : DEFAULT_STREAK;
};

export const updateStreak = async (goalCompleted: boolean): Promise<StreakData> => {
  const streak = await getStreak();
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (!goalCompleted) return streak;

  let newStreak = {...streak};

  if (streak.lastCompletedDate === today) {
    return streak;
  } else if (streak.lastCompletedDate === yesterday) {
    newStreak.currentStreak += 1;
  } else {
    newStreak.currentStreak = 1;
  }

  newStreak.lastCompletedDate = today;
  if (newStreak.currentStreak > newStreak.longestStreak) {
    newStreak.longestStreak = newStreak.currentStreak;
  }

  await AsyncStorage.setItem(KEYS.STREAK, JSON.stringify(newStreak));
  return newStreak;
};

export const checkStreakValidity = async (): Promise<StreakData> => {
  const streak = await getStreak();
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (
    streak.currentStreak > 0 &&
    streak.lastCompletedDate !== today &&
    streak.lastCompletedDate !== yesterday
  ) {
    const reset = {...streak, currentStreak: 0};
    await AsyncStorage.setItem(KEYS.STREAK, JSON.stringify(reset));
    return reset;
  }
  return streak;
};
