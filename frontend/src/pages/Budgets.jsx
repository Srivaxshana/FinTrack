import { useEffect, useState } from 'react';
import api from '../api/axios';

const inputStyle = { background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: 8, padding: '10px 14px', color: 'var(--text-primary)', fontSize: 14, width: '100%', boxSizing: 'border-box' };
const labelStyle = { color: 'var(--text-muted)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 };

export default function Budgets() {
  const [budgets, setBudgets]       = useState([]);
  const [categories, setCategories] = useState([]);
  const [modal, setModal]           = useState(false);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState({ category: '', amount: '', period: 'monthly' });
  const [loading, setLoading]       = useState(false);

  const load = async () => {
    const [bRes, cRes] = await Promise.all([api.get('/budgets'), api.get('/categories')]);
    setBudgets(bRes.data);
    setCategories(cRes.data.filter(c => c.type === 'expense'));
  };

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setEditing(null); setForm({ category: '', amount: '', period: 'monthly' }); setModal(true); };
  const openEdit = (b) => { setEditing(b._id); setForm({ category: b.category, amount: b.amount, period: b.period }); setModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (editing) await api.put(`/budgets/${editing}`, form);
      else         await api.post('/budgets', form);
      setModal(false); load();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this budget?')) return;
    await api.delete(`/budgets/${id}`); load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ color: 'var(--text-primary)', fontSize: 28, fontWeight: 700, margin: 0 }}>Budgets</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0' }}>Set limits and watch your spending stay on track.</p>
        </div>
        <button onClick={openAdd} style={{ background: 'var(--accent)', border: 'none', borderRadius: 10, padding: '11px 20px', color: 'var(--text-primary)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>+ Add Budget</button>
      </div>

      {budgets.length === 0 ? (
        <div style={{ background: 'var(--card-bg)', borderRadius: 14, padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>No budgets yet. Click "Add Budget" to get started.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {budgets.map(b => {
            const pct = b.percentage || 0;
            const over = pct >= 100;
            return (
              <div key={b._id} style={{ background: 'var(--card-bg)', borderRadius: 14, padding: 24, position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 16 }}>{b.category}</span>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{b.period}</span>
                    <button onClick={() => openEdit(b)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>✏️</button>
                    <button onClick={() => handleDelete(b._id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>🗑️</button>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
                  <span style={{ color: over ? 'var(--danger)' : 'var(--text-primary)', fontSize: 26, fontWeight: 700 }}>${(b.spent || 0).toFixed(2)}</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: 15 }}>/ ${b.amount.toFixed(2)}</span>
                </div>
                <div style={{ background: 'var(--border)', borderRadius: 99, height: 8, overflow: 'hidden', marginBottom: 8 }}>
                  <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: over ? 'var(--danger)' : 'var(--accent)', borderRadius: 99, transition: 'width 0.3s' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: over ? 'var(--danger)' : 'var(--text-secondary)', fontSize: 13, fontWeight: over ? 700 : 400 }}>{pct}% used</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{over ? `Over by $${(b.spent - b.amount).toFixed(2)}` : `$${(b.amount - b.spent).toFixed(2)} left`}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: 'var(--card-bg)', borderRadius: 16, padding: 32, width: 380 }}>
            <h3 style={{ color: 'var(--text-primary)', margin: '0 0 24px', fontSize: 20 }}>{editing ? 'Edit Budget' : 'Add Budget'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle} required>
                  <option value="">Select expense category...</option>
                  {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Budget Amount ($)</label>
                <input type="number" step="0.01" min="0" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} style={inputStyle} required />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Period</label>
                <select value={form.period} onChange={e => setForm({ ...form, period: e.target.value })} style={inputStyle}>
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" onClick={() => setModal(false)} style={{ flex: 1, background: 'var(--border)', border: 'none', borderRadius: 8, padding: 12, color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                <button type="submit" disabled={loading} style={{ flex: 1, background: 'var(--accent)', border: 'none', borderRadius: 8, padding: 12, color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 600 }}>{loading ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
