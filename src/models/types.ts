export type CategoryType =
  | 'morning'
  | 'evening'
  | 'prayer'
  | 'sleep'
  | 'istighfar'
  | 'tasbeeh'
  | 'salawat'
  | 'misc';

export interface DhikrItem {
  id: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  count: number;
  source?: string;
  category: CategoryType;
}

export interface DhikrCategory {
  id: string;
  name: string;
  icon: string;
  type: CategoryType;
  adhkar: DhikrItem[];
}

export interface DailyChallenge {
  id: string;
  name: string;
  dhikrId: string;
  dhikrText: string;
  targetCount: number;
  currentCount: number;
  createdAt: string;
  isCompleted: boolean;
}

export interface DailyStats {
  date: string;
  totalCount: number;
  goalTarget: number;
  goalCompleted: boolean;
}

export interface AppSettings {
  dailyGoal: number;
  hapticEnabled: boolean;
  notificationsEnabled: boolean;
  morningNotifTime: string;
  eveningNotifTime: string;
  periodicNotifHours: number;
  lockEnabled: boolean;
  lockedApps: string[];
}

export interface StreakData {
  currentStreak: number;
  lastCompletedDate: string;
  longestStreak: number;
}
