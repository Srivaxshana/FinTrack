import { useEffect, useState } from 'react';
import api from '../api/axios';

const inputStyle = { background: '#0a1628', border: '1px solid #233554', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, width: '100%', boxSizing: 'border-box' };
const labelStyle = { color: '#ccd6f6', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 };

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories]     = useState([]);
  const [filters, setFilters]           = useState({ startDate: '', endDate: '', category: '', type: '' });
  const [modal, setModal]               = useState(false);
  const [editing, setEditing]           = useState(null);
  const [form, setForm]                 = useState({ title: '', amount: '', category: '', type: 'expense', date: '', note: '' });
  const [loading, setLoading]           = useState(false);

  const load = async () => {
    const params = {};
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate)   params.endDate   = filters.endDate;
    if (filters.category)  params.category  = filters.category;
    if (filters.type)      params.type      = filters.type;
    const [txRes, catRes] = await Promise.all([api.get('/transactions', { params }), api.get('/categories')]);
    setTransactions(txRes.data);
    setCategories(catRes.data);
  };

  useEffect(() => { load(); }, [filters]);

  const openAdd = () => {
    const avail = categories.filter(c => c.type === 'expense');
    if (avail.length === 0) {
      if (confirm('No expense categories found. Create one now?')) window.location.href = '/categories';
      return;
    }
    setEditing(null); setForm({ title: '', amount: '', category: '', type: 'expense', date: '', note: '' }); setModal(true);
  };
  const openEdit = (t) => { setEditing(t._id); setForm({ title: t.title, amount: t.amount, category: t.category, type: t.type, date: t.date.split('T')[0], note: t.note || '' }); setModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    if (!form.category) { alert('Please select a category (or create one in Categories).'); setLoading(false); return; }
    try {
      if (editing) await api.put(`/transactions/${editing}`, form);
      else         await api.post('/transactions', form);
      setModal(false); load();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this transaction?')) return;
    await api.delete(`/transactions/${id}`); load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: 0 }}>Transactions</h1>
          <p style={{ color: '#8892b0', margin: '4px 0 0' }}>All your income and expenses in one place.</p>
        </div>
        <button onClick={openAdd} style={{ background: '#10b981', border: 'none', borderRadius: 10, padding: '11px 20px', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>+ Add Transaction</button>
      </div>

      {/* Filters */}
      <div style={{ background: '#112240', borderRadius: 14, padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 14 }}>
          {[['From','date','startDate'],['To','date','endDate']].map(([l,t,k]) => (
            <div key={k}>
              <label style={labelStyle}>{l}</label>
              <input type={t} value={filters[k]} onChange={e => setFilters({ ...filters, [k]: e.target.value })} style={inputStyle} />
            </div>
          ))}
          <div>
            <label style={labelStyle}>Category</label>
            <select value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })} style={inputStyle}>
              <option value="">All</option>
              {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Type</label>
            <select value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })} style={inputStyle}>
              <option value="">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#112240', borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1e3a5f' }}>
              {['Title','Category','Type','Amount','Date','Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', color: '#8892b0', fontSize: 13, fontWeight: 600, padding: '14px 20px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr><td colSpan={6} style={{ color: '#8892b0', textAlign: 'center', padding: 40 }}>No transactions found.</td></tr>
            ) : transactions.map(t => (
              <tr key={t._id} style={{ borderBottom: '1px solid #1a2f4e' }}>
                <td style={{ color: '#ccd6f6', padding: '14px 20px', fontWeight: 500 }}>{t.title}</td>
                <td style={{ color: '#8892b0', padding: '0 20px' }}>{t.category}</td>
                <td style={{ padding: '0 20px' }}>
                  <span style={{ background: t.type === 'income' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: t.type === 'income' ? '#10b981' : '#ef4444', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{t.type}</span>
                </td>
                <td style={{ color: t.type === 'income' ? '#10b981' : '#ef4444', fontWeight: 600, padding: '0 20px' }}>{t.type === 'income' ? '+' : '−'}${t.amount.toFixed(2)}</td>
                <td style={{ color: '#8892b0', padding: '0 20px', fontSize: 13 }}>{new Date(t.date).toLocaleDateString()}</td>
                <td style={{ padding: '0 20px' }}>
                  <button onClick={() => openEdit(t)} style={{ background: 'none', border: 'none', color: '#8892b0', cursor: 'pointer', fontSize: 16, marginRight: 8 }}>✏️</button>
                  <button onClick={() => handleDelete(t._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 16 }}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: '#112240', borderRadius: 16, padding: 32, width: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
            <h3 style={{ color: '#fff', margin: '0 0 24px', fontSize: 20 }}>{editing ? 'Edit Transaction' : 'Add Transaction'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Title</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} required placeholder="e.g. Grocery shopping" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={labelStyle}>Amount</label>
                  <input type="number" step="0.01" min="0" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} style={inputStyle} required />
                </div>
                <div>
                  <label style={labelStyle}>Date</label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={inputStyle} required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle} required>
                    <option value="">Select...</option>
                    {categories.filter(c => c.type === form.type).map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value, category: '' })} style={inputStyle}>
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Note (optional)</label>
                <input value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} style={inputStyle} placeholder="Any additional details..." />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" onClick={() => setModal(false)} style={{ flex: 1, background: '#1e3a5f', border: 'none', borderRadius: 8, padding: 12, color: '#ccd6f6', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                <button type="submit" disabled={loading} style={{ flex: 1, background: '#10b981', border: 'none', borderRadius: 8, padding: 12, color: '#fff', cursor: 'pointer', fontWeight: 600 }}>{loading ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
