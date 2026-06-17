import { useState, useEffect } from 'react';
import api from '../api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // In a real app we would fetch from the API.
    // We mock it temporarily if the backend isn't up, but here we try the real API.
    api.get('/api/dashboard')
      .then(res => setStats(res.data))
      .catch(err => {
        console.error("Failed to fetch dashboard stats", err);
        // Fallback mock data
        setStats({
          total_models: 3,
          total_campaigns: 12,
          total_attacks: 1540,
          successful_attacks: 342,
          average_vulnerability: 22.2
        });
      });
  }, []);

  if (!stats) return <div className="animate-fade-in">Loading dashboard...</div>;

  const mockChartData = [
    { name: 'Prompt Injection', vulnerability: 45 },
    { name: 'Jailbreak', vulnerability: 25 },
    { name: 'Roleplay', vulnerability: 15 },
    { name: 'Sys Extraction', vulnerability: 35 },
    { name: 'Ctx Manipulation', vulnerability: 10 },
  ];

  return (
    <div className="animate-fade-in">
      <h1>Dashboard Overview</h1>
      <p>High-level metrics across all models and campaigns.</p>

      <div className="dashboard-grid">
        <div className="glass-panel stat-card">
          <span className="stat-title">Platform Vulnerability</span>
          <span className={`stat-value ${stats.average_vulnerability > 50 ? 'danger' : 'success'}`}>
            {stats.average_vulnerability}%
          </span>
        </div>
        <div className="glass-panel stat-card">
          <span className="stat-title">Total Attacks Executed</span>
          <span className="stat-value">{stats.total_attacks}</span>
        </div>
        <div className="glass-panel stat-card">
          <span className="stat-title">Successful Attacks</span>
          <span className="stat-value danger">{stats.successful_attacks}</span>
        </div>
        <div className="glass-panel stat-card">
          <span className="stat-title">Active Campaigns</span>
          <span className="stat-value">{stats.total_campaigns}</span>
        </div>
      </div>

      <div className="glass-panel" style={{ height: '400px', marginTop: '24px' }}>
        <h2>Vulnerability by Category (Mock Data)</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockChartData}>
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} 
            />
            <Bar dataKey="vulnerability" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;
