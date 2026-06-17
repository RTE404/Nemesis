import { useState, useEffect } from 'react';
import api from '../api';

function Models() {
  const [models, setModels] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', provider: 'openai', model_identifier: '' });

  const fetchModels = () => {
    api.get('/api/models')
      .then(res => setModels(res.data))
      .catch(err => console.error("Failed to fetch models", err));
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const PREDEFINED_MODELS = [
    { name: "OpenAI GPT-4o", provider: "openai", model_identifier: "gpt-4o" },
    { name: "OpenAI GPT-4 Turbo", provider: "openai", model_identifier: "gpt-4-turbo" },
    { name: "OpenAI GPT-3.5 Turbo", provider: "openai", model_identifier: "gpt-3.5-turbo" },
    { name: "Google Gemini 3.1 Pro", provider: "google", model_identifier: "gemini/gemini-3.1-pro" },
    { name: "Google Gemini 3.5 Flash", provider: "google", model_identifier: "gemini/gemini-3.5-flash" },
    { name: "Anthropic Claude 3.5 Sonnet", provider: "anthropic", model_identifier: "claude-3-5-sonnet-20240620" },
    { name: "Anthropic Claude 3 Opus", provider: "anthropic", model_identifier: "claude-3-opus-20240229" },
    { name: "Anthropic Claude 3 Haiku", provider: "anthropic", model_identifier: "claude-3-haiku-20240307" },
    { name: "Meta Llama 3 8B (via Groq)", provider: "groq", model_identifier: "groq/llama3-8b-8192" },
    { name: "Meta Llama 3 70B (via Groq)", provider: "groq", model_identifier: "groq/llama3-70b-8192" },
    { name: "Mistral Large", provider: "mistral", model_identifier: "mistral/mistral-large-latest" },
    { name: "Cohere Command R+", provider: "cohere", model_identifier: "cohere/command-r-plus" }
  ];

  const [selectedModelIdx, setSelectedModelIdx] = useState(0);

  const handleRegister = (e) => {
    e.preventDefault();
    const modelToRegister = PREDEFINED_MODELS[selectedModelIdx];
    api.post('/api/models', modelToRegister)
      .then(() => {
        setShowModal(false);
        fetchModels();
      })
      .catch(err => alert("Failed to register model: " + err));
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1>Registered Models</h1>
          <p>Manage Target LLMs for evaluation.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>Register Model</button>
      </div>

      <div className="dashboard-grid">
        {models.map(m => (
          <div key={m.id} className="glass-panel stat-card" style={{ gap: '12px' }}>
            <h3 style={{ marginBottom: 0 }}>{m.name}</h3>
            <span className="badge badge-success" style={{ alignSelf: 'flex-start' }}>{m.provider}</span>
            <p style={{ fontSize: '0.9rem', marginBottom: 0 }}>ID: {m.model_identifier}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>DB ID: {m.id}</p>
          </div>
        ))}
        {models.length === 0 && <p>No models registered yet.</p>}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Register New Model</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label className="form-label">Select Model</label>
                <select className="form-control" value={selectedModelIdx} onChange={e => setSelectedModelIdx(parseInt(e.target.value))}>
                  {PREDEFINED_MODELS.map((m, idx) => (
                    <option key={idx} value={idx}>{m.name}</option>
                  ))}
                </select>
                <p style={{ fontSize: '0.8rem', marginTop: '12px', color: 'var(--text-secondary)' }}>
                  Selected Model Identifier: {PREDEFINED_MODELS[selectedModelIdx].model_identifier}
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Register</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Models;
