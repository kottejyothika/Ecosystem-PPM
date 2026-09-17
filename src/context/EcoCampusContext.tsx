import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  UserRole,
  CollectionStation,
  CollectionRecord,
  SegregationStats,
  ReusableAlternative,
  Reward,
  RedeemedReward,
  Campaign,
  NotificationItem,
  MonthlyMetric,
  PlasticType,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_STATIONS,
  INITIAL_COLLECTIONS,
  INITIAL_SEGREGATION_STATS,
  INITIAL_ALTERNATIVES,
  INITIAL_REWARDS,
  INITIAL_CAMPAIGNS,
  INITIAL_NOTIFICATIONS,
  INITIAL_MONTHLY_METRICS,
} from '../data/initialData';

interface EcoCampusContextType {
  currentUser: User;
  users: User[];
  currentRole: UserRole;
  currentView: string;
  setCurrentView: (view: string) => void;
  stations: CollectionStation[];
  collections: CollectionRecord[];
  segregationStats: SegregationStats[];
  alternatives: ReusableAlternative[];
  rewards: Reward[];
  redeemedRewards: RedeemedReward[];
  campaigns: Campaign[];
  notifications: NotificationItem[];
  monthlyMetrics: MonthlyMetric[];
  unreadNotificationCount: number;
  login: (email: string, role?: UserRole) => boolean;
  register: (name: string, email: string, role: UserRole, department: string) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  reportCollection: (
    stationId: string,
    plasticType: PlasticType,
    quantity: number,
    photoUrl?: string
  ) => { success: boolean; message: string; points: number };
  workerCollect: (
    stationId: string,
    quantity: number,
    category: PlasticType
  ) => { success: boolean; message: string };
  workerRecycle: (category: PlasticType, quantity: number) => void;
  addStation: (stationData: Partial<CollectionStation>) => void;
  updateStation: (stationId: string, updates: Partial<CollectionStation>) => void;
  deleteStation: (stationId: string) => void;
  redeemReward: (rewardId: string) => { success: boolean; message: string; code?: string };
  registerCampaign: (campaignId: string) => { success: boolean; message: string };
  createCampaign: (campaignData: Partial<Campaign>) => void;
  pledgeAlternative: (altId: string) => void;
  markNotificationsRead: (id?: string) => void;
  resetDemoData: () => void;
  toast: { message: string; type: 'success' | 'info' | 'warning' | 'error' } | null;
  setToast: (toast: { message: string; type: 'success' | 'info' | 'warning' | 'error' } | null) => void;
}

const EcoCampusContext = createContext<EcoCampusContextType | undefined>(undefined);

export const EcoCampusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from LocalStorage or Fallback to Initial Data
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('ecocampus_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('ecocampus_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // Aarav Sharma (student)
  });

  const [currentView, setCurrentView] = useState<string>('landing');

  const [stations, setStations] = useState<CollectionStation[]>(() => {
    const saved = localStorage.getItem('ecocampus_stations');
    return saved ? JSON.parse(saved) : INITIAL_STATIONS;
  });

  const [collections, setCollections] = useState<CollectionRecord[]>(() => {
    const saved = localStorage.getItem('ecocampus_collections');
    return saved ? JSON.parse(saved) : INITIAL_COLLECTIONS;
  });

  const [segregationStats, setSegregationStats] = useState<SegregationStats[]>(() => {
    const saved = localStorage.getItem('ecocampus_segregation');
    return saved ? JSON.parse(saved) : INITIAL_SEGREGATION_STATS;
  });

  const [alternatives, setAlternatives] = useState<ReusableAlternative[]>(() => {
    const saved = localStorage.getItem('ecocampus_alternatives');
    return saved ? JSON.parse(saved) : INITIAL_ALTERNATIVES;
  });

  const [rewards, setRewards] = useState<Reward[]>(() => {
    const saved = localStorage.getItem('ecocampus_rewards');
    return saved ? JSON.parse(saved) : INITIAL_REWARDS;
  });

  const [redeemedRewards, setRedeemedRewards] = useState<RedeemedReward[]>(() => {
    const saved = localStorage.getItem('ecocampus_redeemed');
    return saved ? JSON.parse(saved) : [];
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem('ecocampus_campaigns');
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('ecocampus_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [monthlyMetrics] = useState<MonthlyMetric[]>(INITIAL_MONTHLY_METRICS);

  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'info' | 'warning' | 'error';
  } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('ecocampus_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('ecocampus_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('ecocampus_stations', JSON.stringify(stations));
  }, [stations]);

  useEffect(() => {
    localStorage.setItem('ecocampus_collections', JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    localStorage.setItem('ecocampus_segregation', JSON.stringify(segregationStats));
  }, [segregationStats]);

  useEffect(() => {
    localStorage.setItem('ecocampus_alternatives', JSON.stringify(alternatives));
  }, [alternatives]);

  useEffect(() => {
    localStorage.setItem('ecocampus_rewards', JSON.stringify(rewards));
  }, [rewards]);

  useEffect(() => {
    localStorage.setItem('ecocampus_redeemed', JSON.stringify(redeemedRewards));
  }, [redeemedRewards]);

  useEffect(() => {
    localStorage.setItem('ecocampus_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('ecocampus_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Toast Auto-Dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#059669', '#34d399', '#fef08a', '#14b8a6'],
      });
    } catch {
      // safe fallback
    }
  };

  const unreadNotificationCount = notifications.filter((n) => {
    if (n.read_status) return false;
    if (n.roleTarget === 'all') return true;
    return n.roleTarget === currentUser.role;
  }).length;

  // Login
  const login = (email: string, role?: UserRole): boolean => {
    let found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found && role) {
      found = users.find((u) => u.role === role);
    }
    if (found) {
      setCurrentUser(found);
      if (found.role === 'admin') setCurrentView('admin-dashboard');
      else if (found.role === 'worker') setCurrentView('worker-dashboard');
      else setCurrentView('student-dashboard');
      showToast(`Welcome back, ${found.name}! Logged in as ${found.role.toUpperCase()}`, 'success');
      return true;
    }
    showToast('Invalid credentials. Please click a Demo Login button!', 'error');
    return false;
  };

  // Register
  const register = (name: string, email: string, role: UserRole, department: string): boolean => {
    if (!name || !email) {
      showToast('Please enter both name and email.', 'warning');
      return false;
    }
    const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      showToast('An account with this email already exists.', 'warning');
      return false;
    }
    const newUser: User = {
      user_id: `usr_${Date.now()}`,
      name,
      email,
      role,
      reward_points: 150, // Welcome reward bonus
      created_at: new Date().toISOString().split('T')[0],
      department: department || 'Undergraduate Campus Studies',
      plasticCollectedKg: 0,
      plasticReducedKg: 0,
      recyclingContributions: 0,
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    triggerConfetti();
    if (role === 'admin') setCurrentView('admin-dashboard');
    else if (role === 'worker') setCurrentView('worker-dashboard');
    else setCurrentView('student-dashboard');
    showToast(`Account created! You received +150 Welcome Reward Points!`, 'success');
    return true;
  };

  const logout = () => {
    setCurrentView('landing');
    showToast('You have been logged out.', 'info');
  };

  // Quick Demo Role Switcher
  const switchRole = (role: UserRole) => {
    const targetUser = users.find((u) => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
      if (role === 'admin') setCurrentView('admin-dashboard');
      else if (role === 'worker') setCurrentView('worker-dashboard');
      else setCurrentView('student-dashboard');
      showToast(`Switched view to ${role.toUpperCase()} (${targetUser.name})`, 'info');
    }
  };

  // Student Plastic Waste Report
  const reportCollection = (
    stationId: string,
    plasticType: PlasticType,
    quantity: number,
    photoUrl?: string
  ) => {
    if (!stationId || !plasticType || quantity <= 0) {
      showToast('Please select a station, plastic type, and valid quantity.', 'warning');
      return { success: false, message: 'Invalid data', points: 0 };
    }

    const station = stations.find((s) => s.station_id === stationId);
    const stationName = station ? station.name : 'Campus Station';
    const pointsAwarded = Math.round(quantity * 20); // 20 points per kg!

    const newRecord: CollectionRecord = {
      collection_id: `COL-${Date.now().toString().slice(-4)}`,
      user_id: currentUser.user_id,
      userName: currentUser.name,
      station_id: stationId,
      stationName,
      plastic_type: plasticType,
      quantity,
      date: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      verification_status: 'Verified',
      photoUrl,
      pointsAwarded,
      segregated: true,
      recycled: false,
    };

    setCollections((prev) => [newRecord, ...prev]);

    // Update Station Capacity & Status
    setStations((prev) =>
      prev.map((s) => {
        if (s.station_id === stationId) {
          const newQty = Number((s.current_quantity + quantity).toFixed(1));
          const pct = (newQty / s.capacity) * 100;
          let status: 'Available' | 'Almost Full' | 'Full' | 'Collected' = 'Available';
          if (pct >= 100) status = 'Full';
          else if (pct >= 80) status = 'Almost Full';

          return {
            ...s,
            current_quantity: newQty,
            status,
            last_collection: 'Just now',
          };
        }
        return s;
      })
    );

    // Update Current User
    setCurrentUser((prev) => ({
      ...prev,
      reward_points: prev.reward_points + pointsAwarded,
      plasticCollectedKg: Number((prev.plasticCollectedKg + quantity).toFixed(1)),
      recyclingContributions: prev.recyclingContributions + 1,
    }));

    setUsers((prev) =>
      prev.map((u) =>
        u.user_id === currentUser.user_id
          ? {
              ...u,
              reward_points: u.reward_points + pointsAwarded,
              plasticCollectedKg: Number((u.plasticCollectedKg + quantity).toFixed(1)),
              recyclingContributions: u.recyclingContributions + 1,
            }
          : u
      )
    );

    // Update Segregation buckets
    setSegregationStats((prev) =>
      prev.map((seg) =>
        seg.category === plasticType
          ? {
              ...seg,
              collected: Number((seg.collected + quantity).toFixed(1)),
              segregated: Number((seg.segregated + quantity).toFixed(1)),
              pending: Number((seg.pending + quantity).toFixed(1)),
            }
          : seg
      )
    );

    // Add Notifications
    const newNotifications: NotificationItem[] = [
      {
        notification_id: `notif_${Date.now()}_std`,
        roleTarget: 'student',
        user_id: currentUser.user_id,
        title: 'Reward Points Credited!',
        message: `You earned +${pointsAwarded} points for depositing ${quantity} kg ${plasticType} at ${stationName}!`,
        type: 'reward',
        timestamp: 'Just now',
        read_status: false,
      },
      {
        notification_id: `notif_${Date.now()}_adm`,
        roleTarget: 'admin',
        title: 'New Waste Collection Logged',
        message: `${currentUser.name} deposited ${quantity} kg ${plasticType} at ${stationName}.`,
        type: 'system',
        timestamp: 'Just now',
        read_status: false,
        stationId,
      },
    ];

    // Smart Alert check: If > 80% or 100% full
    if (station) {
      const projectedQty = station.current_quantity + quantity;
      const pct = (projectedQty / station.capacity) * 100;
      if (pct >= 100) {
        newNotifications.push({
          notification_id: `alert_${Date.now()}_full`,
          roleTarget: 'admin',
          title: `Urgent: Station ${station.station_id} is full.`,
          message: `Station ${station.station_id} (${station.name}) has hit 100% capacity (${projectedQty.toFixed(1)} kg). Urgent collection required.`,
          type: 'alert',
          timestamp: 'Just now',
          read_status: false,
          stationId,
        });
        newNotifications.push({
          notification_id: `alert_${Date.now()}_worker`,
          roleTarget: 'worker',
          title: `Assigned Station ${station.station_id} is Full`,
          message: `${station.name} (${station.location}) needs priority clearance.`,
          type: 'task',
          timestamp: 'Just now',
          read_status: false,
          stationId,
        });
      } else if (pct >= 80) {
        newNotifications.push({
          notification_id: `alert_${Date.now()}_almost`,
          roleTarget: 'admin',
          title: `Station ${station.station_id} is almost full.`,
          message: `Station ${station.station_id} capacity is at ${Math.round(pct)}%. Collection required.`,
          type: 'alert',
          timestamp: 'Just now',
          read_status: false,
          stationId,
        });
      }
    }

    setNotifications((prev) => [...newNotifications, ...prev]);

    triggerConfetti();
    showToast(`Successfully reported ${quantity} kg of ${plasticType}! Earned +${pointsAwarded} Points!`, 'success');
    return { success: true, message: 'Collection logged', points: pointsAwarded };
  };

  // Worker Empties a Station & Moves to Segregation
  const workerCollect = (stationId: string, quantity: number, category: PlasticType) => {
    const station = stations.find((s) => s.station_id === stationId);
    if (!station) return { success: false, message: 'Station not found' };

    const collectedQty = quantity > 0 ? quantity : station.current_quantity;

    setStations((prev) =>
      prev.map((s) =>
        s.station_id === stationId
          ? {
              ...s,
              current_quantity: 0,
              status: 'Collected',
              last_collection: 'Just now by Sanitation Worker',
            }
          : s
      )
    );

    // Update Segregation
    setSegregationStats((prev) =>
      prev.map((seg) =>
        seg.category === category
          ? {
              ...seg,
              segregated: Number((seg.segregated + collectedQty).toFixed(1)),
              pending: Math.max(0, Number((seg.pending - collectedQty).toFixed(1))),
            }
          : seg
      )
    );

    // Notification to admin
    setNotifications((prev) => [
      {
        notification_id: `notif_${Date.now()}`,
        roleTarget: 'admin',
        title: `Station ${station.station_id} Collected`,
        message: `Waste Worker cleared ${collectedQty} kg from ${station.name}. Station bin is now available.`,
        type: 'system',
        timestamp: 'Just now',
        read_status: false,
        stationId,
      },
      ...prev,
    ]);

    showToast(`Station ${station.station_id} cleared (${collectedQty} kg logged into segregation queue)`, 'success');
    return { success: true, message: 'Station cleared' };
  };

  // Worker Marks Waste As Sent for Recycling
  const workerRecycle = (category: PlasticType, quantity: number) => {
    setSegregationStats((prev) =>
      prev.map((seg) =>
        seg.category === category
          ? {
              ...seg,
              recycled: Number((seg.recycled + quantity).toFixed(1)),
              segregated: Math.max(0, Number((seg.segregated - quantity).toFixed(1))),
            }
          : seg
      )
    );

    setNotifications((prev) => [
      {
        notification_id: `notif_${Date.now()}`,
        roleTarget: 'admin',
        title: `Recycling Batch Dispatched: ${category}`,
        message: `${quantity} kg of segregated ${category} sent to certified industrial recycler.`,
        type: 'system',
        timestamp: 'Just now',
        read_status: false,
      },
      ...prev,
    ]);

    showToast(`Dispatched ${quantity} kg of ${category} for industrial recycling!`, 'success');
  };

  // Admin Stations Management
  const addStation = (stationData: Partial<CollectionStation>) => {
    const newId = `ST-0${stations.length + 1}`;
    const newStation: CollectionStation = {
      station_id: newId,
      name: stationData.name || 'New Campus Station',
      location: stationData.location || 'Central Quad',
      zone: stationData.zone || 'Campus Zone',
      mapCoords: stationData.mapCoords || { x: 50, y: 50 },
      capacity: stationData.capacity || 50,
      current_quantity: 0,
      status: 'Available',
      acceptedTypes: stationData.acceptedTypes || ['PET Bottles', 'Plastic Bags', 'Plastic Containers'],
      assigned_worker: stationData.assigned_worker || 'Ramesh Kumar',
      last_collection: 'Brand New Station',
    };
    setStations((prev) => [...prev, newStation]);
    showToast(`Added new station ${newStation.station_id} (${newStation.name})`, 'success');
  };

  const updateStation = (stationId: string, updates: Partial<CollectionStation>) => {
    setStations((prev) =>
      prev.map((s) => {
        if (s.station_id === stationId) {
          const updated = { ...s, ...updates };
          const pct = (updated.current_quantity / updated.capacity) * 100;
          if (pct >= 100) updated.status = 'Full';
          else if (pct >= 80) updated.status = 'Almost Full';
          return updated;
        }
        return s;
      })
    );
    showToast(`Updated station ${stationId}`, 'info');
  };

  const deleteStation = (stationId: string) => {
    setStations((prev) => prev.filter((s) => s.station_id !== stationId));
    showToast(`Deleted station ${stationId}`, 'warning');
  };

  // Redeem Reward
  const redeemReward = (rewardId: string) => {
    const reward = rewards.find((r) => r.reward_id === rewardId);
    if (!reward) return { success: false, message: 'Reward not found' };

    if (currentUser.reward_points < reward.points_required) {
      showToast(
        `Insufficient points! You need ${reward.points_required} pts, but have ${currentUser.reward_points} pts.`,
        'warning'
      );
      return { success: false, message: 'Insufficient points' };
    }

    if (reward.stock <= 0) {
      showToast('This reward is currently out of stock.', 'warning');
      return { success: false, message: 'Out of stock' };
    }

    // Deduct points
    const newPoints = currentUser.reward_points - reward.points_required;
    setCurrentUser((prev) => ({ ...prev, reward_points: newPoints }));
    setUsers((prev) =>
      prev.map((u) => (u.user_id === currentUser.user_id ? { ...u, reward_points: newPoints } : u))
    );

    // Reduce stock
    setRewards((prev) =>
      prev.map((r) => (r.reward_id === rewardId ? { ...r, stock: r.stock - 1 } : r))
    );

    const claimCode = `ECO-${Math.random().toString(36).substring(2, 7).toUpperCase()}-2026`;
    const redemption: RedeemedReward = {
      redemption_id: `red_${Date.now()}`,
      reward_id: reward.reward_id,
      reward_name: reward.reward_name,
      user_id: currentUser.user_id,
      userName: currentUser.name,
      points_spent: reward.points_required,
      redeemed_at: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      claim_code: claimCode,
      status: 'Issued',
    };

    setRedeemedRewards((prev) => [redemption, ...prev]);

    setNotifications((prev) => [
      {
        notification_id: `notif_${Date.now()}`,
        roleTarget: 'student',
        user_id: currentUser.user_id,
        title: 'Reward Voucher Issued!',
        message: `You redeemed "${reward.reward_name}". Code: ${claimCode}`,
        type: 'reward',
        timestamp: 'Just now',
        read_status: false,
      },
      ...prev,
    ]);

    triggerConfetti();
    showToast(`Claim code: ${claimCode} for ${reward.reward_name}!`, 'success');
    return { success: true, message: 'Redeemed successfully', code: claimCode };
  };

  // Campaigns
  const registerCampaign = (campaignId: string) => {
    const campaign = campaigns.find((c) => c.campaign_id === campaignId);
    if (!campaign) return { success: false, message: 'Campaign not found' };

    if (campaign.registeredUserIds.includes(currentUser.user_id)) {
      showToast('You are already registered for this campaign.', 'info');
      return { success: false, message: 'Already registered' };
    }

    if (campaign.current_participants >= campaign.max_participants) {
      showToast('This campaign has reached maximum capacity.', 'warning');
      return { success: false, message: 'Capacity reached' };
    }

    setCampaigns((prev) =>
      prev.map((c) =>
        c.campaign_id === campaignId
          ? {
              ...c,
              current_participants: c.current_participants + 1,
              registeredUserIds: [...c.registeredUserIds, currentUser.user_id],
            }
          : c
      )
    );

    const bonusPoints = campaign.pointsReward;
    setCurrentUser((prev) => ({ ...prev, reward_points: prev.reward_points + bonusPoints }));
    setUsers((prev) =>
      prev.map((u) =>
        u.user_id === currentUser.user_id ? { ...u, reward_points: u.reward_points + bonusPoints } : u
      )
    );

    setNotifications((prev) => [
      {
        notification_id: `notif_${Date.now()}`,
        roleTarget: 'student',
        user_id: currentUser.user_id,
        title: 'Campaign Registration Confirmed',
        message: `Registered for "${campaign.title}"! +${bonusPoints} bonus points credited.`,
        type: 'campaign',
        timestamp: 'Just now',
        read_status: false,
      },
      ...prev,
    ]);

    triggerConfetti();
    showToast(`Registered for "${campaign.title}"! +${bonusPoints} Points Awarded!`, 'success');
    return { success: true, message: 'Registered' };
  };

  const createCampaign = (campaignData: Partial<Campaign>) => {
    const newCamp: Campaign = {
      campaign_id: `cmp-0${campaigns.length + 1}`,
      title: campaignData.title || 'Campus Green Action',
      description: campaignData.description || 'Plastic reduction campaign',
      date: campaignData.date || '2026-04-20',
      time: campaignData.time || '10:00 AM - 12:00 PM',
      location: campaignData.location || 'Central Amphitheatre',
      max_participants: campaignData.max_participants || 50,
      current_participants: 1,
      registeredUserIds: [],
      posterTag: campaignData.posterTag || 'Green Drive',
      pointsReward: campaignData.pointsReward || 50,
      status: 'Upcoming',
    };
    setCampaigns((prev) => [newCamp, ...prev]);
    setNotifications((prev) => [
      {
        notification_id: `notif_${Date.now()}`,
        roleTarget: 'student',
        title: 'New Campus Campaign Live',
        message: `Join "${newCamp.title}" on ${newCamp.date} to earn +${newCamp.pointsReward} pts!`,
        type: 'campaign',
        timestamp: 'Just now',
        read_status: false,
      },
      ...prev,
    ]);
    showToast(`Campaign "${newCamp.title}" created successfully!`, 'success');
  };

  // Alternatives Pledge
  const pledgeAlternative = (altId: string) => {
    setAlternatives((prev) =>
      prev.map((alt) => (alt.id === altId ? { ...alt, pledgeCount: alt.pledgeCount + 1 } : alt))
    );
    const pointsAward = 30;
    setCurrentUser((prev) => ({
      ...prev,
      reward_points: prev.reward_points + pointsAward,
      plasticReducedKg: Number((prev.plasticReducedKg + 2.5).toFixed(1)),
    }));
    setUsers((prev) =>
      prev.map((u) =>
        u.user_id === currentUser.user_id
          ? {
              ...u,
              reward_points: u.reward_points + pointsAward,
              plasticReducedKg: Number((u.plasticReducedKg + 2.5).toFixed(1)),
            }
          : u
      )
    );
    triggerConfetti();
    showToast(`Pledged reusable alternative! +${pointsAward} Eco Points awarded!`, 'success');
  };

  // Notifications
  const markNotificationsRead = (id?: string) => {
    setNotifications((prev) =>
      prev.map((n) => (id ? (n.notification_id === id ? { ...n, read_status: true } : n) : { ...n, read_status: true }))
    );
  };

  // Reset to default
  const resetDemoData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setStations(INITIAL_STATIONS);
    setCollections(INITIAL_COLLECTIONS);
    setSegregationStats(INITIAL_SEGREGATION_STATS);
    setAlternatives(INITIAL_ALTERNATIVES);
    setRewards(INITIAL_REWARDS);
    setRedeemedRewards([]);
    setCampaigns(INITIAL_CAMPAIGNS);
    setNotifications(INITIAL_NOTIFICATIONS);
    showToast('Demo data reset to initial clean prototype state!', 'info');
  };

  return (
    <EcoCampusContext.Provider
      value={{
        currentUser,
        users,
        currentRole: currentUser.role,
        currentView,
        setCurrentView,
        stations,
        collections,
        segregationStats,
        alternatives,
        rewards,
        redeemedRewards,
        campaigns,
        notifications,
        monthlyMetrics,
        unreadNotificationCount,
        login,
        register,
        logout,
        switchRole,
        reportCollection,
        workerCollect,
        workerRecycle,
        addStation,
        updateStation,
        deleteStation,
        redeemReward,
        registerCampaign,
        createCampaign,
        pledgeAlternative,
        markNotificationsRead,
        resetDemoData,
        toast,
        setToast,
      }}
    >
      {children}
    </EcoCampusContext.Provider>
  );
};

export const useEcoCampus = () => {
  const context = useContext(EcoCampusContext);
  if (!context) {
    throw new Error('useEcoCampus must be used within an EcoCampusProvider');
  }
  return context;
};
