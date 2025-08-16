// src/components/AdminCanvasDashboard.js
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import './manger.css';

const STATUS_COLORS = {
  draft:    '#6c757d',
  saved:    '#17a2b8',
  exported: '#28a745',
  archived: '#dc3545'
};

const ManagerComponent = () => {
  const [canvases, setCanvases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusTab, setStatusTab] = useState('all');
  const [search, setSearch] = useState('');
  const token = localStorage.getItem('token');

  // Fetch all user canvases
  useEffect(() => {
    const fetchCanvases = async () => {
      try {
        const res = await axios.get(
          'https://api.mattyai.com/admin/canvases',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCanvases(res.data);
      } catch (err) {
        console.error('Error fetching canvases:', err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };
    fetchCanvases();
  }, [token]);

  // Filtered & sorted
  const filtered = useMemo(() => {
    return canvases
      .filter(c =>
        (statusTab === 'all' || c.status === statusTab) &&
        (search.trim() === '' ||
          c.title.toLowerCase().includes(search.toLowerCase()) ||
          c.userName.toLowerCase().includes(search.toLowerCase()))
      )
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [canvases, statusTab, search]);

  // Update canvas status
  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(
        `https://api.mattyai.com/admin/canvases/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCanvases(prev =>
        prev.map(c => (c._id === id ? { ...c, status: newStatus } : c))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading canvases…</div>;
  }

  // Stats
  const total    = canvases.length;
  const draft    = canvases.filter(c => c.status === 'draft').length;
  const saved    = canvases.filter(c => c.status === 'saved').length;
  const exported = canvases.filter(c => c.status === 'exported').length;
  const archived = canvases.filter(c => c.status === 'archived').length;

  return (
    <div className="admin-canvas-dashboard">
      <h2>Matty AI Canvas Management</h2>

      {/* Stats cards */}
      <div className="stats-cards">
        <StatCard label="Total Canvases" value={total} color="#007bff" />
        <StatCard label="Draft"          value={draft}    color={STATUS_COLORS.draft} />
        <StatCard label="Saved"          value={saved}    color={STATUS_COLORS.saved} />
        <StatCard label="Exported"       value={exported} color={STATUS_COLORS.exported} />
        <StatCard label="Archived"       value={archived} color={STATUS_COLORS.archived} />
      </div>

      {/* Filters */}
      <div className="admin-filters">
        {['all','draft','saved','exported','archived'].map(key => (
          <button
            key={key}
            className={statusTab === key ? 'filter active' : 'filter'}
            onClick={() => setStatusTab(key)}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
        <input
          type="text"
          placeholder="Search canvases…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Canvas list */}
      {filtered.length === 0 ? (
        <p className="no-results">No canvases match your filters.</p>
      ) : (
        <div className="canvas-list">
          {filtered.map(c => (
            <div key={c._id} className="canvas-card">
              <header>
                <strong>{c.title}</strong>
                <div className="user-name">{c.userName}</div>
              </header>
              <p className="canvas-meta">
                Last updated: {new Date(c.updatedAt).toLocaleDateString()}
              </p>
              <footer>
                <span
                  className="status-badge"
                  style={{ background: STATUS_COLORS[c.status] }}
                >
                  {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                </span>
                <select
                  value={c.status}
                  onChange={e => updateStatus(c._id, e.target.value)}
                >
                  {['draft','saved','exported','archived'].map(s => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </footer>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div className="stat-card" style={{ borderColor: color }}>
    <h3 style={{ color }}>{value}</h3>
    <p>{label}</p>
  </div>
);

export default ManagerComponent;
