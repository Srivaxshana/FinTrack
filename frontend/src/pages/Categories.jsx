import { useEffect, useState } from 'react';
import api from '../api/axios';

const inputStyle = { background: '#0a1628', border: '1px solid #233554', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, width: '100%', boxSizing: 'border-box' };
const labelStyle = { color: '#ccd6f6', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 };

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [modal, setModal]           = useState(false);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState({ name: '', type: 'expense' });
  const [loading, setLoading]       = useState(false);

  const load = () => api.get('/categories').then(r => setCategories(r.data));
  useEffect(() => { load(); }, []);

  const openAdd  = () => { setEditing(null); setForm({ name: '', type: 'expense' }); setModal(true); };
  const openEdit = (c) => { setEditing(c._id); setForm({ name: c.name, type: c.type }); setModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (editing) await api.put(`/categories/${editing}`, form);
      else         await api.post('/categories', form);
      setModal(false); load();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    await api.delete(`/categories/${id}`); load();
  };

  const income  = categories.filter(c => c.type === 'income');
  const expense = categories.filter(c => c.type === 'expense');

  const Section = ({ title, items, color }) => (
    <div style={{ background: '#112240', borderRadius: 14, padding: 24, marginBottom: 16 }}>
      <h3 style={{ color: '#fff', margin: '0 0 20px', fontSize: 16 }}>{title}</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {items.length === 0 && <span style={{ color: '#8892b0', fontSize: 14 }}>No categories yet.</span>}
        {items.map(c => (
          <div key={c._id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: `${color}15`, border: `1px solid ${color}40`, borderRadius: 99, padding: '7px 16px' }}>
            <span style={{ color, fontSize: 14, fontWeight: 500 }}>{c.name}</span>
            <button onClick={() => openEdit(c)} style={{ background: 'none', border: 'none', color: '#8892b0', cursor: 'pointer', padding: 0, fontSize: 13 }}>✏️</button>
            <button onClick={() => handleDelete(c._id)} style={{ background: 'none', border: 'none', color: color === '#10b981' ? '#8892b0' : '#ef4444', cursor: 'pointer', padding: 0, fontSize: 13 }}>🗑️</button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: 0 }}>Categories</h1>
          <p style={{ color: '#8892b0', margin: '4px 0 0' }}>Organize your income and expenses.</p>
        </div>
        <button onClick={openAdd} style={{ background: '#10b981', border: 'none', borderRadius: 10, padding: '11px 20px', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>+ Add Category</button>
      </div>

      <Section title="Income Categories"  items={income}  color="#10b981" />
      <Section title="Expense Categories" items={expense} color="#ef4444" />

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: '#112240', borderRadius: 16, padding: 32, width: 360 }}>
            <h3 style={{ color: '#fff', margin: '0 0 24px', fontSize: 20 }}>{editing ? 'Edit Category' : 'Add Category'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Category Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} required placeholder="e.g. Groceries" />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inputStyle}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
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
