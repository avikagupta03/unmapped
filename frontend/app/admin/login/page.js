'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminLogin } from '../../../lib/api';
import axios from 'axios';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await adminLogin(form);
      localStorage.setItem('adminToken', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-um-black flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-display font-black text-4xl text-um-white mb-2">unmapped</h1>
          <p className="text-white/30 text-xs font-mono uppercase tracking-widest">Admin Portal</p>
        </div>
        <div className="glass rounded-3xl p-8">
          <h2 className="font-display font-bold text-xl text-um-white mb-6">Sign in</h2>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-white/40 text-xs uppercase tracking-wider mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required placeholder="admin@unmapped.in" className="um-input" />
            </div>
            <div>
              <label className="block text-white/40 text-xs uppercase tracking-wider mb-1.5">Password</label>
              <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required placeholder="••••••••" className="um-input" />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="w-full py-3.5 bg-um-accent text-um-black font-bold rounded-xl hover:bg-um-warm transition-all text-sm disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
        </div>
        <p className="text-center mt-6">
          <Link href="/" className="text-white/20 hover:text-white/40 text-xs transition-colors">← Back to website</Link>
        </p>
      </div>
    </div>
  );
}
