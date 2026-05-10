import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const COLORS = ['#10b981','#3b82f6','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#ec4899'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const Card = ({ title, value, sub, icon, iconBg }) => (
  <div style={{ background: '#112240', borderRadius: 14, padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
    <div>
      <div style={{ color: '#8892b0', fontSize: 13, marginBottom: 8 }}>{title}</div>
      <div style={{ color: '#fff', fontSize: 28, fontWeight: 700, marginBottom: 4 }}>{value}</div>
      <div style={{ color: '#8892b0', fontSize: 12 }}>{sub}</div>
    </div>
    <div style={{ background: iconBg, borderRadius: 10, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{icon}</div>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/dashboard').then(r => setData(r.data)).catch(console.error);
  }, []);

  const fmt = (n) => '$' + (n || 0).toLocaleString('en-US', { minimumFractionDigits: 0 });

  const pieData = data?.expenseByCategory?.map(e => ({ name: e._id, value: e.total })) || [];

  // Build monthly chart data
  const monthlyMap = {};
  (data?.monthly || []).forEach(m => {
    const key = `${MONTHS[m._id.month - 1]}`;
    if (!monthlyMap[key]) monthlyMap[key] = { month: key, income: 0, expense: 0 };
    monthlyMap[key][m._id.type] = m.total;
  });
  const monthlyData = Object.values(monthlyMap);

  return (
    <div>
      <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: '0 0 4px' }}>Dashboard</h1>
      <p style={{ color: '#8892b0', marginBottom: 28 }}>Welcome back{user?.name ? `, ${user.name}` : ''} — here's how your money is doing.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card title="Total Income"   value={fmt(data?.summary?.totalIncome)}  sub="This month" icon="↗" iconBg="rgba(16,185,129,0.2)" />
        <Card title="Total Expenses" value={fmt(data?.summary?.totalExpense)} sub="This month" icon="↘" iconBg="rgba(239,68,68,0.2)" />
        <Card title="Current Balance" value={fmt(data?.summary?.balance)}    sub="Income – expenses" icon="💼" iconBg="rgba(59,130,246,0.2)" />
        <Card title="Budget Usage"   value={`${data?.summary?.budgetUsage || 0}%`} sub={`${fmt(data?.summary?.budgetSpent)} of ${fmt(data?.summary?.budgetTotal)}`} icon="🎯" iconBg="rgba(245,158,11,0.2)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#112240', borderRadius: 14, padding: 24 }}>
          <h3 style={{ color: '#fff', margin: '0 0 20px', fontSize: 16 }}>Expenses by Category</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => '$' + v.toFixed(2)} contentStyle={{ background: '#0d1f3c', border: '1px solid #1e3a5f', borderRadius: 8, color: '#fff' }} />
                <Legend formatter={(v) => <span style={{ color: '#ccd6f6', fontSize: 12 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p style={{ color: '#8892b0', textAlign: 'center', marginTop: 60 }}>No expense data yet</p>}
        </div>

        <div style={{ background: '#112240', borderRadius: 14, padding: 24 }}>
          <h3 style={{ color: '#fff', margin: '0 0 20px', fontSize: 16 }}>Monthly Income vs Expenses</h3>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" stroke="#8892b0" fontSize={11} />
                <YAxis stroke="#8892b0" fontSize={11} tickFormatter={v => '$'+v} />
                <Tooltip contentStyle={{ background: '#0d1f3c', border: '1px solid #1e3a5f', borderRadius: 8, color: '#fff' }} formatter={v => '$'+v.toFixed(2)} />
                <Legend formatter={(v) => <span style={{ color: '#ccd6f6', fontSize: 12 }}>{v}</span>} />
                <Bar dataKey="income"  fill="#10b981" radius={[4,4,0,0]} />
                <Bar dataKey="expense" fill="#ef4444" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p style={{ color: '#8892b0', textAlign: 'center', marginTop: 60 }}>No monthly data yet</p>}
        </div>
      </div>

      <div style={{ background: '#112240', borderRadius: 14, padding: 24 }}>
        <h3 style={{ color: '#fff', margin: '0 0 16px', fontSize: 16 }}>Recent Transactions</h3>
        {data?.recentTransactions?.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Title','Category','Type','Amount','Date'].map(h => (
                  <th key={h} style={{ textAlign: 'left', color: '#8892b0', fontSize: 13, fontWeight: 600, padding: '0 0 12px', borderBottom: '1px solid #1e3a5f' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.recentTransactions.map(t => (
                <tr key={t._id}>
                  <td style={{ color: '#ccd6f6', padding: '12px 0', fontSize: 14, fontWeight: 500 }}>{t.title}</td>
                  <td style={{ color: '#8892b0', fontSize: 14 }}>{t.category}</td>
                  <td><span style={{ background: t.type === 'income' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: t.type === 'income' ? '#10b981' : '#ef4444', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{t.type}</span></td>
                  <td style={{ color: t.type === 'income' ? '#10b981' : '#ef4444', fontWeight: 600, fontSize: 14 }}>{t.type === 'income' ? '+' : '−'}${t.amount.toFixed(2)}</td>
                  <td style={{ color: '#8892b0', fontSize: 13 }}>{new Date(t.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p style={{ color: '#8892b0', textAlign: 'center', padding: '20px 0' }}>No transactions yet. Add some to see them here.</p>}
      </div>
    </div>
  );
}
