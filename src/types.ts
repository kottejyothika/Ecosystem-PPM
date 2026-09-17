export type UserRole = 'student' | 'admin' | 'worker';

export type PlasticType = 'PET Bottles' | 'Plastic Bags' | 'Plastic Containers' | 'Other Plastic';

export type StationStatus = 'Available' | 'Almost Full' | 'Full' | 'Collected';

export interface User {
  user_id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  reward_points: number;
  created_at: string;
  avatar?: string;
  department?: string;
  plasticCollectedKg: number;
  plasticReducedKg: number;
  recyclingContributions: number;
}

export interface CollectionRecord {
  collection_id: string;
  user_id: string;
  userName: string;
  station_id: string;
  stationName: string;
  plastic_type: PlasticType;
  quantity: number; // in kg
  date: string;
  verification_status: 'Verified' | 'Pending Verification' | 'Rejected';
  photoUrl?: string;
  pointsAwarded: number;
  segregated?: boolean;
  recycled?: boolean;
}

export interface CollectionStation {
  station_id: string;
  name: string;
  location: string;
  zone: string;
  mapCoords: { x: number; y: number }; // Percentage on campus map
  capacity: number; // in kg
  current_quantity: number; // in kg
  status: StationStatus;
  acceptedTypes: PlasticType[];
  assigned_worker: string;
  last_collection: string;
}

export interface SegregationStats {
  category: PlasticType;
  collected: number;
  segregated: number;
  recycled: number;
  pending: number;
  color: string;
}

export interface ReusableAlternative {
  id: string;
  disposableItem: string;
  reusableItem: string;
  icon: string;
  category: string;
  environmentalBenefit: string;
  plasticReductionKgPerYear: number;
  pledgeCount: number;
  costEstimate: string;
}

export interface Reward {
  reward_id: string;
  reward_name: string;
  points_required: number;
  availability: boolean;
  stock: number;
  category: string;
  description: string;
  icon: string;
  badgeCode?: string;
}

export interface RedeemedReward {
  redemption_id: string;
  reward_id: string;
  reward_name: string;
  user_id: string;
  userName: string;
  points_spent: number;
  redeemed_at: string;
  claim_code: string;
  status: 'Issued' | 'Claimed';
}

export interface Campaign {
  campaign_id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  max_participants: number;
  current_participants: number;
  registeredUserIds: string[];
  posterTag: string;
  pointsReward: number;
  status: 'Upcoming' | 'Active' | 'Completed';
}

export interface NotificationItem {
  notification_id: string;
  user_id?: string;
  roleTarget: 'all' | 'student' | 'admin' | 'worker';
  title: string;
  message: string;
  type: 'reward' | 'campaign' | 'achievement' | 'alert' | 'task' | 'system' | 'station_alert' | 'reward_earned';
  timestamp: string;
  read_status: boolean;
  stationId?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  badge: string;
}

export interface EcoTip {
  id: string;
  title: string;
  tip: string;
  icon: string;
  impactLevel: 'High' | 'Medium' | 'Daily Habit';
  category?: string;
}

export interface MonthlyMetric {
  month: string;
  collected: number;
  recycled: number;
  reductionRate: number;
  studentCount: number;
}
