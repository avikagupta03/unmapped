'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { getMyInquiries } from '../../lib/api';
import Navbar from '../../components/sections/Navbar';
import { Footer } from '../../components/sections/HomeSections';

const STATUS_STYLE = {
  pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  contacted: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  confirmed: 'text-green-400 bg-green-400/10 border-green-400/20',
};

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [tab, setTab] = useState('bookings');
  const router = useRouter();

  useEffect(() => { if (!loading && !user) router.push('/auth'); }, [user, loading, router]);
  useEffect(() => { if (user) { getMyInquiries().then(r => setInquiries(r.data || [])).catch(() => {}); } }, [user]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out. See you soon! 👋');
    router.push('/');
  };

  if (loading) return <div className="min-h-screen bg-um-black flex items-center justify-center"><p className="text-um-beige font-mono animate-pulse">Loading...</p></div>;
  if (!user) return null;

  return (
    <main className="min-h-screen bg-um-black">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-16">

        {/* Profile header */}
        <div className="glass rounded-3xl p-8 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-um-accent/20 border border-um-accent/30 flex items-center justify-center text-2xl font-bold text-um-accent flex-shrink-0">
            {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full rounded-2xl object-cover" /> : user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="font-display font-black text-2xl text-um-white">{user.name}</h1>
            <p className="text-white/40 text-sm">{user.email}</p>
            <p className="text-um-accent text-xs font-mono mt-1">unmapped traveler</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link href="/trips" className="px-4 py-2 bg-um-accent text-um-black text-sm font-bold rounded-full hover:bg-um-warm transition-all">Browse Trips</Link>
            <button onClick={handleLogout} className="px-4 py-2 border border-white/10 text-white/50 text-sm rounded-full hover:bg-white/5 transition-all">Logout</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-um-charcoal rounded-xl p-1 w-fit mb-8">
          {['bookings', 'saved'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? 'bg-um-accent text-um-black' : 'text-white/45 hover:text-white/70'}`}>
              {t === 'bookings' ? `My Bookings (${inquiries.length})` : 'Saved Trips'}
            </button>
          ))}
        </div>

        {tab === 'bookings' && (
          <div className="space-y-4">
            {inquiries.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">🏔️</p>
                <p className="text-white/40 text-lg mb-2">No bookings yet.</p>
                <Link href="/trips" className="text-um-accent hover:text-um-warm text-sm transition-colors">Browse trips →</Link>
              </div>
            ) : inquiries.map(inq => (
              <div key={inq._id} className="glass rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h3 className="text-um-white font-bold mb-1">{inq.selectedTrip}</h3>
                    <div className="flex flex-wrap gap-3 text-xs text-white/40">
                      <span>👥 {inq.travelers} travelers</span>
                      <span>🧭 {inq.travelType}</span>
                      {inq.preferredDate && <span>📅 {inq.preferredDate}</span>}
                      {inq.budget && <span>💰 {inq.budget}</span>}
                    </div>
                    <p className="text-white/20 text-xs mt-2">{new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-full border capitalize font-mono ${STATUS_STYLE[inq.status]}`}>{inq.status}</span>
                </div>
                {inq.adminNote && (
                  <div className="mt-3 p-3 rounded-xl bg-um-beige/5 border border-um-beige/15">
                    <p className="text-white/50 text-xs">Note from team: <span className="text-um-beige">{inq.adminNote}</span></p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'saved' && (
          <div>
            {!user.savedTrips || user.savedTrips.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">❤️</p>
                <p className="text-white/40 text-lg mb-2">No saved trips yet.</p>
                <p className="text-white/25 text-sm mb-4">Click the 🤍 on any trip card to save it here.</p>
                <Link href="/trips" className="text-um-accent hover:text-um-warm text-sm transition-colors">Browse trips →</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.savedTrips.map(trip => (
                  <Link key={trip._id} href={`/${trip.type==='trek'?'trek':'trips'}/${trip.slug}`}
                    className="group glass rounded-2xl overflow-hidden card-hover">
                    <div className="relative h-48 overflow-hidden">
                      <img src={trip.image} alt={trip.title} className="w-full h-full object-cover img-zoom"/>
                      <div className="absolute inset-0" style={{background:'linear-gradient(to top,rgba(10,10,10,0.9) 0%,transparent 60%)'}}/>
                      <span className="absolute top-3 right-3 text-base">❤️</span>
                    </div>
                    <div className="p-4">
                      <p className="text-um-accent/70 text-xs font-mono mb-1">{trip.location}</p>
                      <h3 className="font-display font-bold text-um-white mb-2 group-hover:text-um-beige transition-colors">{trip.title}</h3>
                      <div className="flex items-center justify-between">
                        <span className="font-display font-bold text-um-beige">₹{trip.price?.toLocaleString()}</span>
                        <span className="text-white/35 text-xs">{trip.duration}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
