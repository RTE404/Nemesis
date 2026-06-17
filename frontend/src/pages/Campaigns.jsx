import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [models, setModels] = useState([]);
  
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  
  const [formData, setFormData] = useState({ 
    name: '', 
    target_model_id: '', 
    count_per_category: 2,
    categories: ['prompt_injection', 'jailbreak', 'roleplay']
  });
  
  const [reportData, setReportData] = useState(null);
  const [selectedCampaignName, setSelectedCampaignName] = useState('');

  const availableCategories = ['prompt_injection', 'jailbreak', 'roleplay', 'system_extraction', 'context_manipulation'];

  const fetchCampaigns = () => {
    axios.get('http://localhost:8000/api/campaigns')
      .then(res => setCampaigns(res.data))
      .catch(err => console.error("Failed to fetch campaigns", err));
  };

  const fetchModels = () => {
    axios.get('http://localhost:8000/api/models')
      .then(res => {
        setModels(res.data);
        if (res.data.length > 0) {
          setFormData(prev => ({ ...prev, target_model_id: res.data[0].id }));
        }
      })
      .catch(err => console.error("Failed to fetch models", err));
  };

  useEffect(() => {
    fetchCampaigns();
    fetchModels();
  }, []);

  const handleLaunch = (e) => {
    e.preventDefault();
    if (!formData.target_model_id) return alert("Please select a target model.");
    
    axios.post('http://localhost:8000/api/campaigns', formData)
      .then(() => {
        setShowLaunchModal(false);
        fetchCampaigns();
      })
      .catch(err => alert("Failed to launch campaign: " + err));
  };

  const handleCategoryChange = (cat) => {
    setFormData(prev => {
      const current = prev.categories;
      if (current.includes(cat)) {
        return { ...prev, categories: current.filter(c => c !== cat) };
      } else {
        return { ...prev, categories: [...current, cat] };
      }
    });
  };

  const viewReport = (campaignId, campaignName) => {
    axios.get(`http://localhost:8000/api/campaigns/${campaignId}/metrics`)
      .then(res => {
        setReportData(res.data);
        setSelectedCampaignName(campaignName);
        setShowReportModal(true);
      })
      .catch(err => alert("Failed to fetch report: " + err));
  };

  const getChartData = () => {
    if (!reportData || !reportData.categories) return [];
    return Object.entries(reportData.categories).map(([key, val]) => ({
      name: key.replace('_', ' ').toUpperCase(),
      successRate: val.success_rate * 100
    }));
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1>Attack Campaigns</h1>
          <p>Manage and monitor red teaming experiments.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowLaunchModal(true)}>Launch Campaign</button>
      </div>

      <div className="glass-panel">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Target Model ID</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map(c => (
                <tr key={c.id}>
                  <td>#{c.id}</td>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{c.name}</td>
                  <td>{c.target_model_id}</td>
                  <td>
                    <span className={`badge ${c.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => viewReport(c.id, c.name)}>View Report</button>
                  </td>
                </tr>
              ))}
              {campaigns.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No campaigns launched yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showLaunchModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Launch New Campaign</h2>
              <button className="modal-close" onClick={() => setShowLaunchModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleLaunch}>
              <div className="form-group">
                <label className="form-label">Campaign Name</label>
                <input required className="form-control" placeholder="e.g. Gemini Jailbreak Eval" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Target Model</label>
                <select className="form-control" required value={formData.target_model_id} onChange={e => setFormData({...formData, target_model_id: parseInt(e.target.value)})}>
                  <option value="" disabled>Select a model</option>
                  {models.map(m => (
                    <option key={m.id} value={m.id}>{m.name} (ID: {m.id})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Attacks Per Category</label>
                <input type="number" min="1" max="50" required className="form-control" value={formData.count_per_category} onChange={e => setFormData({...formData, count_per_category: parseInt(e.target.value)})} />
              </div>
              <div className="form-group">
                <label className="form-label">Categories Included</label>
                <div className="checkbox-group">
                  {availableCategories.map(cat => (
                    <label key={cat} className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={formData.categories.includes(cat)} 
                        onChange={() => handleCategoryChange(cat)}
                      />
                      {cat.replace('_', ' ')}
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowLaunchModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Launch</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showReportModal && reportData && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h2>Report: {selectedCampaignName}</h2>
              <button className="modal-close" onClick={() => setShowReportModal(false)}>&times;</button>
            </div>
            
            <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
              <div className="stat-card">
                <span className="stat-title">Vulnerability Score</span>
                <span className={`stat-value ${reportData.vulnerability_score > 50 ? 'danger' : 'success'}`}>
                  {reportData.vulnerability_score}%
                </span>
              </div>
              <div className="stat-card">
                <span className="stat-title">Attacks Succeeded</span>
                <span className="stat-value">{reportData.successful_attacks} / {reportData.total_attacks}</span>
              </div>
              <div className="stat-card">
                <span className="stat-title">Avg. Judge Confidence</span>
                <span className="stat-value">{reportData.average_judge_confidence.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ height: '250px', width: '100%' }}>
              <h3 style={{ marginBottom: '16px' }}>Category Success Rates</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getChartData()}>
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 10}} />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                  <Bar dataKey="successRate" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Campaigns;
