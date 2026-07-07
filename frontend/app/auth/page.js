'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { registerUser, loginUser, setAuthToken } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/sections/Navbar';
import { Footer } from '../../components/sections/HomeSections';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

export default function AuthPage() {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    document.head.appendChild(script);
    script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });
    };
    return () => { try { document.head.removeChild(script); } catch {} };
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      const axios = (await import('axios')).default;
      const res = await axios.post(`${API}/users/google`, {
        googleId: payload.sub, email: payload.email, name: payload.name, avatar: payload.picture,
      }, { withCredentials: true });
      login(res.data.token, res.data.user);
      localStorage.setItem('userToken', res.data.token);
      toast.success(`Welcome, ${res.data.user.name}! 🏔️`);
      router.push('/profile');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Google login failed.');
    }
  };

  const handleGoogleLogin = () => {
    if (!GOOGLE_CLIENT_ID) {
      toast('Add NEXT_PUBLIC_GOOGLE_CLIENT_ID to .env.local for Google login.', { icon: '🔵' });
      return;
    }
    window.google?.accounts.id.prompt();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fn = tab === 'login' ? loginUser : registerUser;
      const res = await fn(form);
      login(res.data.token, res.data.user);
      setAuthToken(res.data.token);
      toast.success(tab === 'login' ? 'Welcome back! 🏔️' : 'Account created! Welcome to unmapped 🎉');
      router.push('/profile');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-um-black">
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-6 pt-20 pb-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="font-display font-black text-3xl text-um-white hover:text-um-beige transition-colors">unmapped</Link>
            <p className="text-white/40 text-sm mt-2">Your adventure account</p>
          </div>

          <div className="glass rounded-3xl p-8">
            {/* Tabs */}
            <div className="flex gap-1 bg-um-black/50 rounded-xl p-1 mb-8">
              {['login', 'signup'].map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? 'bg-um-accent text-um-black' : 'text-white/45 hover:text-white/70'}`}>
                  {t === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              ))}
            </div>

            {/* Google OAuth button */}
            <button onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-3.5 border border-white/10 rounded-xl text-white/70 hover:bg-white/5 hover:border-white/20 transition-all text-sm mb-6">
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z"/>
                <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z"/>
                <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.31z"/>
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-white/8" /><span className="text-white/25 text-xs">or</span><div className="flex-1 h-px bg-white/8" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === 'signup' && (
                <div>
                  <label className="block text-white/40 text-xs uppercase tracking-wider mb-1.5">Full Name *</label>
                  <input className="um-input" placeholder="Your name" value={form.name} onChange={e => set('name', e.target.value)} required />
                </div>
              )}
              <div>
                <label className="block text-white/40 text-xs uppercase tracking-wider mb-1.5">Email *</label>
                <input className="um-input" type="email" placeholder="you@email.com" value={form.email} onChange={e => set('email', e.target.value)} required />
              </div>
              <div>
                <label className="block text-white/40 text-xs uppercase tracking-wider mb-1.5">Password *</label>
                <input className="um-input" type="password" placeholder="Min 6 characters" value={form.password} onChange={e => set('password', e.target.value)} required minLength={6} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-4 bg-um-accent text-um-black font-bold rounded-xl hover:bg-um-warm transition-all text-sm disabled:opacity-50 mt-2">
                {loading ? 'Please wait...' : tab === 'login' ? 'Sign In →' : 'Create Account →'}
              </button>
            </form>

            <p className="text-center text-white/30 text-xs mt-5">
              {tab === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => setTab(tab === 'login' ? 'signup' : 'login')} className="text-um-beige hover:text-um-warm transition-colors underline">
                {tab === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          <p className="text-center mt-4">
            <Link href="/" className="text-white/20 hover:text-white/40 text-xs transition-colors">← Back to website</Link>
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
