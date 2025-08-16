// src/components/Manager.js
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import './manger.css';

const STATUS_COLORS = {
  pending:  '#ffc107',
  reviewed: '#17a2b8',
  resolved: '#28a745',
  rejected: '#dc3545'
};

const ManagerComponent = () => {
  const [feedbacks, setFeedbacks]   = useState([]);
  const [loading,   setLoading]     = useState(true);
  const [statusTab, setStatusTab]   = useState('all');      // filter tab
  const [search,    setSearch]      = useState('');         // search text
  const token = localStorage.getItem('token');

  /* ---------- 1. Fetch feedback list ---------- */
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get(
          'https://customerservicefeedback.onrender.com/api/manager/feedback',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFeedbacks(res.data);
      } catch (err) {
        console.error('Error fetching feedbacks:', err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, [token]);

  /* ---------- 2. Memoised filtered list ---------- */
  const filtered = useMemo(() => {
    return feedbacks
      .filter(f =>
        (statusTab === 'all' ? true : f.status === statusTab) &&
        (search.trim() === ''
          ? true
          : f.message.toLowerCase().includes(search.toLowerCase()) ||
            f.customerName.toLowerCase().includes(search.toLowerCase()))
      )
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  }, [feedbacks, statusTab, search]);

  /* ---------- 3. Update status handler ---------- */
  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(
        `https://customerservicefeedback.onrender.com/api/manager/feedback/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedbacks(prev =>
        prev.map(f => (f._id === id ? { ...f, status: newStatus } : f))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  if (loading) return <div className="manager-loading">Loading feedbacks…</div>;

  /* ---------- 4. Statistics ---------- */
  const total   = feedbacks.length;
  const pending = feedbacks.filter(f => f.status === 'pending').length;
  const reviewed= feedbacks.filter(f => f.status === 'reviewed').length;
  const resolved= feedbacks.filter(f => f.status === 'resolved').length;
  const rejected= total - pending - reviewed - resolved;

  return (
    <div className="manager-dashboard">
      <h2>Customer Feedback Management</h2>

      {/* Stats cards */}
      <div className="stats">
        <StatCard label="Total"    value={total}    color="#007bff" />
        <StatCard label="Pending"  value={pending}  color={STATUS_COLORS.pending} />
        <StatCard label="Reviewed" value={reviewed} color={STATUS_COLORS.reviewed} />
        <StatCard label="Resolved" value={resolved} color={STATUS_COLORS.resolved} />
        <StatCard label="Rejected" value={rejected} color={STATUS_COLORS.rejected} />
      </div>

      {/* Filters */}
      <div className="filters">
        {['all','pending','reviewed','resolved','rejected'].map(key => (
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
          placeholder="Search feedback…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Feedback cards */}
      {filtered.length === 0 ? (
        <p className="no-results">No feedback matches your filters.</p>
      ) : (
        <div className="feedbacks-list">
          {filtered.map(fb => (
            <div key={fb._id} className="feedback-card">
              <header>
                <strong>{fb.customerName}</strong>
                <div className="rating">{'⭐'.repeat(fb.rating)}</div>
              </header>

              <p className="message">{fb.message}</p>

              {fb.suggestions && (
                <p className="suggestions"><em>{fb.suggestions}</em></p>
              )}

              <footer>
                <span
                  className="status-badge"
                  style={{ background: STATUS_COLORS[fb.status] }}
                >
                  {fb.status}
                </span>

                <select
                  value={fb.status}
                  onChange={e => updateStatus(fb._id, e.target.value)}
                >
                  {['pending','reviewed','resolved','rejected'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                <span className="date">
                  {new Date(fb.submittedAt).toLocaleDateString()}
                </span>
              </footer>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ---------- Mini stat card component ---------- */
const StatCard = ({ label, value, color }) => (
  <div className="stat-card" style={{ borderColor: color }}>
    <h3 style={{ color }}>{value}</h3>
    <p>{label}</p>
  </div>
);

export default ManagerComponent;
