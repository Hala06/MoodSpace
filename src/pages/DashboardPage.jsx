import React, { useMemo } from 'react';
import { motion as Motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Calendar, TrendingUp, Zap, Flame, Heart, BookOpen, MessageCircle, ArrowRight, Sparkles, Target } from 'lucide-react';
import { format, subDays, eachDayOfInterval, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { loadCheckins } from '../utils/checkinStorage';
import { getMoodById, moodScoreMap } from '../data/moodData';
import { useAuth } from '../contexts/AuthContext';
import FloatingOrb from '../components/FloatingOrb';
import './dashboard.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const checkins = useMemo(() => loadCheckins(user?.id || 'default'), [user]);

  const last7Days = eachDayOfInterval({ start: subDays(new Date(), 6), end: new Date() });

  const moodTrendData = useMemo(() => {
    return last7Days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const checkinForDay = checkins.find(c => format(parseISO(c.date), 'yyyy-MM-dd') === dayStr);
      const mood = checkinForDay ? getMoodById(checkinForDay.moodId) : null;
      return {
        name: format(day, 'EEE'),
        moodScore: mood ? moodScoreMap[mood.id] : 0,
        moodEmoji: mood ? mood.emoji : '❓'
      };
    });
  }, [checkins, last7Days]);

  const moodDistribution = useMemo(() => {
    const counts = checkins.reduce((acc, checkin) => {
      const mood = getMoodById(checkin.moodId);
      if (mood) {
        acc[mood.spectrum] = (acc[mood.spectrum] || 0) + 1;
      }
      return acc;
    }, {});
    return [
      { name: 'Positive', value: counts.positive || 0 },
      { name: 'Neutral', value: counts.neutral || 0 },
      { name: 'Negative', value: counts.negative || 0 },
    ].filter(d => d.value > 0);
  }, [checkins]);

  const totalCheckins = checkins.length;
  const streak = useMemo(() => {
    if (totalCheckins === 0) return 0;
    let currentStreak = 0;
    const checkinDates = new Set(checkins.map(c => format(parseISO(c.date), 'yyyy-MM-dd')));
    for (let i = 0; i < totalCheckins + 1; i++) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      if (checkinDates.has(date)) {
        currentStreak++;
      } else {
        break;
      }
    }
    return currentStreak;
  }, [checkins, totalCheckins]);

  const averageMood = useMemo(() => {
    if (totalCheckins === 0) return 0;
    const sum = checkins.reduce((acc, c) => acc + (moodScoreMap[c.moodId] || 0), 0);
    return (sum / totalCheckins).toFixed(1);
  }, [checkins, totalCheckins]);

  const insights = useMemo(() => {
    const insightsList = [];
    
    if (streak >= 3) {
      insightsList.push(`Amazing ${streak}-day streak! Keep it going! 🔥`);
    }
    
    if (totalCheckins >= 7) {
      const recentMoods = checkins.slice(0, 7);
      const avgRecent = recentMoods.reduce((acc, c) => acc + (moodScoreMap[c.moodId] || 0), 0) / 7;
      if (avgRecent >= 4) {
        insightsList.push("You've been feeling great this week! ✨");
      }
    }
    
    if (totalCheckins > 0) {
      const lastMood = getMoodById(checkins[0]?.moodId);
      if (lastMood) {
        insightsList.push(`Last check-in: ${lastMood.label} ${lastMood.emoji}`);
      }
    }
    
    if (insightsList.length === 0) {
      insightsList.push("Start checking in daily to unlock insights!");
    }
    
    return insightsList;
  }, [checkins, streak, totalCheckins]);

  const COLORS = {
    Positive: '#22C55E',
    Neutral: '#FBBF24',
    Negative: '#EF4444',
  };

  return (
    <Motion.div
      className="dashboard-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <FloatingOrb opacity={0.2} />
      
      {/* Welcome Header */}
      <Motion.div 
        className="dashboard-welcome"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="welcome-content">
          <h1>Welcome back, {user?.name || 'Friend'}! 👋</h1>
          <p>Here's how you've been doing</p>
        </div>
        {streak > 0 && (
          <Motion.div 
            className="streak-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <Flame size={24} />
            <div>
              <span className="streak-number">{streak}</span>
              <span className="streak-label">day streak</span>
            </div>
          </Motion.div>
        )}
      </Motion.div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard 
          icon={Calendar} 
          label="Total Check-ins" 
          value={totalCheckins}
          color="#667eea"
          delay={0.2}
        />
        <StatCard 
          icon={TrendingUp} 
          label="Current Streak" 
          value={`${streak} days`}
          color="#22c55e"
          delay={0.25}
        />
        <StatCard 
          icon={Zap} 
          label="Avg. Mood Score" 
          value={averageMood}
          color="#f59e0b"
          delay={0.3}
        />
        <StatCard 
          icon={Heart} 
          label="Wellness Level" 
          value={averageMood >= 4 ? "Great" : averageMood >= 3 ? "Good" : "Growing"}
          color="#ec4899"
          delay={0.35}
        />
      </div>

      {/* Insights Card */}
      <Motion.div 
        className="insights-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="insights-header">
          <Sparkles size={24} />
          <h3>Your Insights</h3>
        </div>
        <div className="insights-list">
          {insights.map((insight, index) => (
            <Motion.div 
              key={index}
              className="insight-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Target size={16} />
              <p>{insight}</p>
            </Motion.div>
          ))}
        </div>
      </Motion.div>

      {/* Charts Grid */}
      <div className="charts-grid">
        <ChartCard title="7-Day Mood Trend" delay={0.5}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={moodTrendData}>
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" domain={[0, 5]} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="moodScore" stroke="#667eea" fill="url(#moodGradient)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Mood Distribution" delay={0.6}>
          {moodDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={moodDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {moodDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data">
              <p>No data yet. Start checking in!</p>
            </div>
          )}
        </ChartCard>
      </div>

      {/* Quick Actions */}
      <Motion.div 
        className="quick-actions-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h3>Quick Actions</h3>
        <div className="quick-actions">
          <Motion.button
            className="action-card check-in"
            onClick={() => navigate('/check-in')}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Heart size={28} />
            <div>
              <strong>Check-In</strong>
              <span>How are you feeling today?</span>
            </div>
            <ArrowRight size={20} />
          </Motion.button>

          <Motion.button
            className="action-card journal"
            onClick={() => navigate('/journal')}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <BookOpen size={28} />
            <div>
              <strong>Journal</strong>
              <span>Write your thoughts</span>
            </div>
            <ArrowRight size={20} />
          </Motion.button>

          <Motion.button
            className="action-card forum"
            onClick={() => navigate('/forum')}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <MessageCircle size={28} />
            <div>
              <strong>Community</strong>
              <span>Connect with others</span>
            </div>
            <ArrowRight size={20} />
          </Motion.button>
        </div>
      </Motion.div>
    </Motion.div>
  );
};

const StatCard = ({ icon, label, value, color, delay }) => (
  <Motion.div 
    className="stat-card" 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -5 }}
  >
    <div className="stat-icon" style={{ background: `${color}15`, color }}>
      {React.createElement(icon, { size: 24 })}
    </div>
    <div className="stat-content">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  </Motion.div>
);

const ChartCard = ({ title, children, delay }) => (
  <Motion.div 
    className="chart-card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
  >
    <h2 className="chart-title">{title}</h2>
    {children}
  </Motion.div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label} : ${payload[0].payload.moodEmoji}`}</p>
        <p className="intro">{`Mood Score: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export default DashboardPage;
