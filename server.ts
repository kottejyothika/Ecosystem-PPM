import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
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
} from './src/data/initialData.ts';
import {
  User,
  CollectionStation,
  CollectionRecord,
  SegregationStats,
  Reward,
  RedeemedReward,
  Campaign,
  NotificationItem,
} from './src/types.ts';

// In-Memory Database Store for Fullstack Prototype
let users: User[] = JSON.parse(JSON.stringify(INITIAL_USERS));
let stations: CollectionStation[] = JSON.parse(JSON.stringify(INITIAL_STATIONS));
let collections: CollectionRecord[] = JSON.parse(JSON.stringify(INITIAL_COLLECTIONS));
let segregationStats: SegregationStats[] = JSON.parse(JSON.stringify(INITIAL_SEGREGATION_STATS));
let alternatives = JSON.parse(JSON.stringify(INITIAL_ALTERNATIVES));
let rewards: Reward[] = JSON.parse(JSON.stringify(INITIAL_REWARDS));
let redeemedRewards: RedeemedReward[] = [];
let campaigns: Campaign[] = JSON.parse(JSON.stringify(INITIAL_CAMPAIGNS));
let notifications: NotificationItem[] = JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS));
let monthlyMetrics = JSON.parse(JSON.stringify(INITIAL_MONTHLY_METRICS));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Helper for Smart Alerts
  const checkStationCapacityAlerts = (station: CollectionStation) => {
    const percentage = Math.round((station.current_quantity / station.capacity) * 100);
    if (percentage >= 100) {
      station.status = 'Full';
      const existingAlert = notifications.find(
        (n) => n.stationId === station.station_id && n.title.includes('is Full') && !n.read_status
      );
      if (!existingAlert) {
        notifications.unshift({
          notification_id: `notif_${Date.now()}_full`,
          roleTarget: 'admin',
          title: `Urgent: Station ${station.station_id} is full.`,
          message: `${station.name} has hit 100% capacity (${station.current_quantity} kg). Immediate pickup needed!`,
          type: 'alert',
          timestamp: 'Just now',
          read_status: false,
          stationId: station.station_id,
        });
        notifications.unshift({
          notification_id: `notif_${Date.now()}_worker`,
          roleTarget: 'worker',
          title: `Assigned Station ${station.station_id} is Full`,
          message: `Please empty ${station.name} (${station.location}) and update collection.`,
          type: 'task',
          timestamp: 'Just now',
          read_status: false,
          stationId: station.station_id,
        });
      }
    } else if (percentage >= 80) {
      station.status = 'Almost Full';
      const existingAlert = notifications.find(
        (n) => n.stationId === station.station_id && n.title.includes('almost full') && !n.read_status
      );
      if (!existingAlert) {
        notifications.unshift({
          notification_id: `notif_${Date.now()}_almost`,
          roleTarget: 'admin',
          title: `Station ${station.station_id} is almost full.`,
          message: `Station ${station.station_id} (${station.name}) capacity > 80% (${percentage}%). Collection required.`,
          type: 'alert',
          timestamp: 'Just now',
          read_status: false,
          stationId: station.station_id,
        });
      }
    } else if (station.current_quantity === 0) {
      station.status = 'Collected';
    } else {
      station.status = 'Available';
    }
  };

  // --- AUTH REST APIs ---
  app.post('/api/login', (req, res) => {
    const { email, password, role } = req.body;
    let found = users.find((u) => u.email.toLowerCase() === email?.toLowerCase());
    if (!found) {
      // Fallback demo user finder by role if demo button clicked
      if (role) {
        found = users.find((u) => u.role === role);
      }
    }
    if (found) {
      res.json({ success: true, user: found, token: `fake_jwt_${found.user_id}_2026` });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials. Try using Demo Login buttons!' });
    }
  });

  app.post('/api/register', (req, res) => {
    const { name, email, role, department } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }
    const newUser: User = {
      user_id: `usr_${Date.now()}`,
      name,
      email,
      role: role || 'student',
      reward_points: 100, // Welcome bonus points!
      created_at: new Date().toISOString().split('T')[0],
      department: department || 'General Campus Studies',
      plasticCollectedKg: 0,
      plasticReducedKg: 0,
      recyclingContributions: 0,
    };
    users.push(newUser);
    res.json({ success: true, user: newUser, token: `fake_jwt_${newUser.user_id}` });
  });

  // --- STUDENTS & USERS APIs ---
  app.get('/api/students', (req, res) => {
    const studentList = users
      .filter((u) => u.role === 'student')
      .sort((a, b) => b.reward_points - a.reward_points);
    res.json(studentList);
  });

  app.get('/api/users', (req, res) => {
    res.json(users);
  });

  // --- DASHBOARD DATA API ---
  app.get('/api/dashboard', (req, res) => {
    const totalCollected = Number(collections.reduce((acc, c) => acc + c.quantity, 0).toFixed(1));
    const totalRecycled = Number(
      segregationStats.reduce((acc, s) => acc + s.recycled, 0).toFixed(1)
    );
    const activeStudents = users.filter((u) => u.role === 'student').length;
    const totalStations = stations.length;
    const recyclingRate = totalCollected > 0 ? Math.round((totalRecycled / totalCollected) * 100) : 78;

    res.json({
      kpis: {
        totalPlasticCollected: totalCollected,
        totalPlasticRecycled: totalRecycled,
        plasticReductionRate: 32, // 32%
        activeStudents,
        collectionStations: totalStations,
        recyclingRate,
      },
      recentCollections: collections.slice(0, 8),
      alerts: notifications.filter((n) => n.type === 'alert' && !n.read_status),
      stations,
      segregationStats,
    });
  });

  // --- COLLECTIONS REST APIs ---
  app.get('/api/collections', (req, res) => {
    const userId = req.query.user_id as string;
    if (userId) {
      return res.json(collections.filter((c) => c.user_id === userId));
    }
    res.json(collections);
  });

  app.post('/api/collections', (req, res) => {
    const { user_id, station_id, plastic_type, quantity, photoUrl } = req.body;
    const qty = parseFloat(quantity);
    if (!station_id || !plastic_type || isNaN(qty) || qty <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid station, plastic type or quantity' });
    }

    const station = stations.find((s) => s.station_id === station_id);
    const user = users.find((u) => u.user_id === user_id);

    const stationName = station ? station.name : 'Campus Drop Point';
    const userName = user ? user.name : 'Campus Student';

    const pointsAwarded = Math.round(qty * 20); // 20 points per kg!

    const newRecord: CollectionRecord = {
      collection_id: `COL-${Date.now().toString().slice(-4)}`,
      user_id: user_id || 'usr_student_01',
      userName,
      station_id,
      stationName,
      plastic_type,
      quantity: qty,
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

    collections.unshift(newRecord);

    // Update station capacity
    if (station) {
      station.current_quantity = Number((station.current_quantity + qty).toFixed(1));
      station.last_collection = 'Just now';
      checkStationCapacityAlerts(station);
    }

    // Update user points and stats
    if (user) {
      user.reward_points += pointsAwarded;
      user.plasticCollectedKg = Number((user.plasticCollectedKg + qty).toFixed(1));
      user.recyclingContributions += 1;
    }

    // Update segregation bucket
    const segBucket = segregationStats.find((s) => s.category === plastic_type);
    if (segBucket) {
      segBucket.collected = Number((segBucket.collected + qty).toFixed(1));
      segBucket.segregated = Number((segBucket.segregated + qty).toFixed(1));
      segBucket.pending = Number((segBucket.pending + qty).toFixed(1));
    }

    // Generate Notifications
    notifications.unshift({
      notification_id: `notif_${Date.now()}_student`,
      roleTarget: 'student',
      user_id: user?.user_id,
      title: 'Reward Points Credited!',
      message: `You earned +${pointsAwarded} points for logging ${qty} kg ${plastic_type} at ${stationName}!`,
      type: 'reward',
      timestamp: 'Just now',
      read_status: false,
    });

    notifications.unshift({
      notification_id: `notif_${Date.now()}_admin`,
      roleTarget: 'admin',
      title: 'New Waste Collection Reported',
      message: `${userName} deposited ${qty} kg ${plastic_type} at ${stationName}.`,
      type: 'system',
      timestamp: 'Just now',
      read_status: false,
      stationId: station_id,
    });

    res.json({
      success: true,
      record: newRecord,
      pointsAwarded,
      userPoints: user ? user.reward_points : 0,
      station,
    });
  });

  // --- COLLECTION STATIONS REST APIs ---
  app.get('/api/stations', (req, res) => {
    res.json(stations);
  });

  app.post('/api/stations', (req, res) => {
    const { name, location, zone, capacity, acceptedTypes, assigned_worker } = req.body;
    if (!name || !location || !capacity) {
      return res.status(400).json({ success: false, message: 'Name, location, and capacity are required' });
    }
    const newStation: CollectionStation = {
      station_id: `ST-0${stations.length + 1}`,
      name,
      location,
      zone: zone || 'Campus Zone',
      mapCoords: {
        x: Math.floor(Math.random() * 60) + 20,
        y: Math.floor(Math.random() * 60) + 20,
      },
      capacity: Number(capacity),
      current_quantity: 0,
      status: 'Available',
      acceptedTypes: acceptedTypes || ['PET Bottles', 'Plastic Containers'],
      assigned_worker: assigned_worker || 'Ramesh Kumar',
      last_collection: 'Brand New Station',
    };
    stations.push(newStation);

    notifications.unshift({
      notification_id: `notif_${Date.now()}`,
      roleTarget: 'all',
      title: 'New Collection Station Added',
      message: `Station ${newStation.station_id} (${newStation.name}) is now live at ${newStation.location}!`,
      type: 'system',
      timestamp: 'Just now',
      read_status: false,
    });

    res.json({ success: true, station: newStation });
  });

  app.put('/api/stations/:id', (req, res) => {
    const { id } = req.params;
    const index = stations.findIndex((s) => s.station_id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Station not found' });
    }
    stations[index] = { ...stations[index], ...req.body };
    checkStationCapacityAlerts(stations[index]);
    res.json({ success: true, station: stations[index] });
  });

  app.delete('/api/stations/:id', (req, res) => {
    const { id } = req.params;
    stations = stations.filter((s) => s.station_id !== id);
    res.json({ success: true, message: `Station ${id} removed` });
  });

  // --- REWARDS REST APIs ---
  app.get('/api/rewards', (req, res) => {
    res.json({ rewards, redeemedRewards });
  });

  app.post('/api/rewards/redeem', (req, res) => {
    const { reward_id, user_id } = req.body;
    const reward = rewards.find((r) => r.reward_id === reward_id);
    const user = users.find((u) => u.user_id === user_id);

    if (!reward || !user) {
      return res.status(404).json({ success: false, message: 'Reward or user not found' });
    }

    if (user.reward_points < reward.points_required) {
      return res.status(400).json({
        success: false,
        message: `Insufficient points! You need ${reward.points_required} points but have ${user.reward_points}.`,
      });
    }

    if (reward.stock <= 0) {
      return res.status(400).json({ success: false, message: 'This reward item is currently out of stock!' });
    }

    // Deduct points & update stock
    user.reward_points -= reward.points_required;
    reward.stock -= 1;

    const claimCode = `ECO-${Math.random().toString(36).substring(2, 7).toUpperCase()}-2026`;
    const redemption: RedeemedReward = {
      redemption_id: `red_${Date.now()}`,
      reward_id,
      reward_name: reward.reward_name,
      user_id: user.user_id,
      userName: user.name,
      points_spent: reward.points_required,
      redeemed_at: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      claim_code: claimCode,
      status: 'Issued',
    };
    redeemedRewards.unshift(redemption);

    notifications.unshift({
      notification_id: `notif_${Date.now()}`,
      roleTarget: 'student',
      user_id: user.user_id,
      title: 'Reward Redeemed Successfully!',
      message: `You redeemed "${reward.reward_name}". Claim Code: ${claimCode}.`,
      type: 'reward',
      timestamp: 'Just now',
      read_status: false,
    });

    res.json({
      success: true,
      message: `Successfully redeemed ${reward.reward_name}!`,
      claimCode,
      remainingPoints: user.reward_points,
      redemption,
    });
  });

  // --- CAMPAIGNS REST APIs ---
  app.get('/api/campaigns', (req, res) => {
    res.json(campaigns);
  });

  app.post('/api/campaigns', (req, res) => {
    const { title, description, date, time, location, max_participants, pointsReward, posterTag } = req.body;
    if (!title || !date || !location) {
      return res.status(400).json({ success: false, message: 'Title, date, and location are required' });
    }

    const newCampaign: Campaign = {
      campaign_id: `cmp-0${campaigns.length + 1}`,
      title,
      description: description || 'College awareness campaign against single-use plastics.',
      date,
      time: time || '10:00 AM - 12:00 PM',
      location,
      max_participants: Number(max_participants) || 50,
      current_participants: 1,
      registeredUserIds: [],
      posterTag: posterTag || 'Green Action',
      pointsReward: Number(pointsReward) || 50,
      status: 'Upcoming',
    };
    campaigns.unshift(newCampaign);

    notifications.unshift({
      notification_id: `notif_${Date.now()}`,
      roleTarget: 'student',
      title: 'New Awareness Campaign Announced!',
      message: `Join "${title}" on ${date} at ${location} and earn +${newCampaign.pointsReward} points!`,
      type: 'campaign',
      timestamp: 'Just now',
      read_status: false,
    });

    res.json({ success: true, campaign: newCampaign });
  });

  app.post('/api/campaigns/register', (req, res) => {
    const { campaign_id, user_id } = req.body;
    const campaign = campaigns.find((c) => c.campaign_id === campaign_id);
    const user = users.find((u) => u.user_id === user_id);

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    if (campaign.registeredUserIds.includes(user_id)) {
      return res.status(400).json({ success: false, message: 'You have already registered for this campaign!' });
    }

    if (campaign.current_participants >= campaign.max_participants) {
      return res.status(400).json({ success: false, message: 'Campaign registration is already full!' });
    }

    campaign.registeredUserIds.push(user_id);
    campaign.current_participants += 1;

    if (user) {
      user.reward_points += campaign.pointsReward;
    }

    notifications.unshift({
      notification_id: `notif_${Date.now()}`,
      roleTarget: 'student',
      user_id,
      title: 'Campaign Registration Confirmed!',
      message: `You are registered for "${campaign.title}"! +${campaign.pointsReward} bonus points awarded.`,
      type: 'campaign',
      timestamp: 'Just now',
      read_status: false,
    });

    res.json({
      success: true,
      message: `Registered for "${campaign.title}"! +${campaign.pointsReward} points credited.`,
      currentParticipants: campaign.current_participants,
      userPoints: user?.reward_points,
    });
  });

  // --- WORKER ACTIONS APIs ---
  app.post('/api/worker/collect', (req, res) => {
    const { station_id, quantityCollected, category, notes } = req.body;
    const station = stations.find((s) => s.station_id === station_id);
    if (!station) {
      return res.status(404).json({ success: false, message: 'Station not found' });
    }

    const qty = parseFloat(quantityCollected) || station.current_quantity;

    // Reset station capacity
    station.current_quantity = 0;
    station.status = 'Collected';
    station.last_collection = 'Just now by Worker';

    // Move into Segregation queue
    const segBucket = segregationStats.find((s) => s.category === (category || 'PET Bottles'));
    if (segBucket) {
      segBucket.segregated = Number((segBucket.segregated + qty).toFixed(1));
      segBucket.pending = Math.max(0, Number((segBucket.pending - qty).toFixed(1)));
    }

    notifications.unshift({
      notification_id: `notif_${Date.now()}`,
      roleTarget: 'admin',
      title: `Station ${station.station_id} Cleared`,
      message: `Worker collected ${qty} kg waste from ${station.name}. Bin emptied and available.`,
      type: 'system',
      timestamp: 'Just now',
      read_status: false,
      stationId: station.station_id,
    });

    res.json({ success: true, message: `Station ${station.station_id} successfully collected!`, station });
  });

  app.post('/api/worker/recycle', (req, res) => {
    const { category, quantity } = req.body;
    const segBucket = segregationStats.find((s) => s.category === category);
    if (segBucket) {
      const qty = parseFloat(quantity) || 10;
      segBucket.recycled = Number((segBucket.recycled + qty).toFixed(1));
      res.json({ success: true, segBucket });
    } else {
      res.status(404).json({ success: false, message: 'Category not found' });
    }
  });

  // --- ALTERNATIVES APIs ---
  app.get('/api/alternatives', (req, res) => {
    res.json(alternatives);
  });

  app.post('/api/alternatives/pledge', (req, res) => {
    const { id, user_id } = req.body;
    const alt = alternatives.find((a: any) => a.id === id);
    const user = users.find((u) => u.user_id === user_id);
    if (alt) {
      alt.pledgeCount += 1;
      if (user) {
        user.reward_points += 30; // +30 eco points for pledging!
        user.plasticReducedKg = Number((user.plasticReducedKg + 2.5).toFixed(1));
      }
      res.json({ success: true, pledgeCount: alt.pledgeCount, points: user?.reward_points });
    } else {
      res.status(404).json({ success: false, message: 'Alternative not found' });
    }
  });

  // --- ANALYTICS & REPORTS APIs ---
  app.get('/api/analytics', (req, res) => {
    res.json({
      monthlyMetrics,
      segregationStats,
      categoryShare: segregationStats.map((s) => ({
        name: s.category,
        value: s.collected,
        color: s.color,
      })),
      collectionVsRecycling: segregationStats.map((s) => ({
        category: s.category.replace('Plastic ', ''),
        Collected: s.collected,
        Recycled: s.recycled,
      })),
    });
  });

  app.get('/api/reports', (req, res) => {
    const timeframe = (req.query.timeframe as string) || 'Monthly';
    const totalCollected = Number(collections.reduce((acc, c) => acc + c.quantity, 0).toFixed(1));
    const totalRecycled = Number(
      segregationStats.reduce((acc, s) => acc + s.recycled, 0).toFixed(1)
    );
    const activeStudents = users.filter((u) => u.role === 'student').length;

    res.json({
      reportId: `REP-${timeframe.toUpperCase()}-2026`,
      generatedAt: new Date().toLocaleString(),
      timeframe,
      metrics: {
        totalPlasticCollected: totalCollected,
        totalPlasticRecycled: totalRecycled,
        plasticReductionRate: '32%',
        studentParticipation: activeStudents,
        activeStations: stations.length,
        recyclingRate: totalCollected > 0 ? `${Math.round((totalRecycled / totalCollected) * 100)}%` : '78%',
      },
      topContributors: users
        .filter((u) => u.role === 'student')
        .sort((a, b) => b.plasticCollectedKg - a.plasticCollectedKg)
        .slice(0, 5),
      stationPerformance: stations.map((s) => ({
        id: s.station_id,
        name: s.name,
        capacity: `${s.capacity} kg`,
        currentStatus: s.status,
        fillRate: `${Math.round((s.current_quantity / s.capacity) * 100)}%`,
      })),
    });
  });

  // --- NOTIFICATIONS REST APIs ---
  app.get('/api/notifications', (req, res) => {
    const role = (req.query.role as string) || 'all';
    const filtered = notifications.filter(
      (n) => n.roleTarget === 'all' || n.roleTarget === role
    );
    res.json(filtered);
  });

  app.post('/api/notifications/mark-read', (req, res) => {
    const { notification_id } = req.body;
    if (notification_id) {
      const target = notifications.find((n) => n.notification_id === notification_id);
      if (target) target.read_status = true;
    } else {
      notifications.forEach((n) => (n.read_status = true));
    }
    res.json({ success: true });
  });

  // --- Vite & SPA fallback configuration ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EcoCampus Server running at http://localhost:${PORT}`);
  });
}

startServer();
