'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/sections/Navbar';
import { Footer } from '../../components/sections/HomeSections';
import TripCard from '../../components/shared/TripCard';
import { getTrips } from '../../lib/api';

const FILTERS = [
  { value: '', label: '✦ All Treks' },
  { value: 'easy', label: '🟢 Easy' },
  { value: 'moderate', label: '🟡 Moderate' },
  { value: 'challenging', label: '🔴 Challenging' },
];

function Content() {
  const sp = useSearchParams();
  const diff = sp.get('diff') || '';
  const [active, setActive] = useState(diff);
  const [search, setSearch] = useState('');
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { setActive(diff); }, [diff]);

  useEffect(() => {
    setLoading(true);
    const params = { type: 'trek' };
    if (active) params.difficulty = active;
    if (search) params.search = search;
    getTrips(params).then(r => setTreks(r.data || [])).catch(() => setTreks([])).finally(() => setLoading(false));
  }, [active, search]);

  return (
    <main className="min-h-screen bg-um-black">
      <Navbar />
      <section className="relative h-64 md:h-72 flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(10,10,10,1) 0%,rgba(10,10,10,0.5) 60%,rgba(10,10,10,0.3) 100%)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-10 w-full">
          <div className="flex items-center gap-2 mb-3 text-xs text-white/35">
            <Link href="/" className="hover:text-um-beige transition-colors">Home</Link><span>›</span><span className="text-um-beige">Trek</span>
          </div>
          <h1 className="font-display font-black text-5xl md:text-6xl text-um-white leading-none">The Trail <span className="italic text-um-beige">Awaits.</span></h1>
          <p className="text-white/45 mt-2 text-sm">From easy meadow walks to Himalayan expeditions.</p>
        </div>
      </section>

      <div className="sticky top-14 z-40 bg-um-black/95 backdrop-blur-xl border-b border-white/5 px-6 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-3">
            {FILTERS.map(f => (
              <Link key={f.value} href={f.value ? `/trek?diff=${f.value}` : '/trek'}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm border transition-all duration-200 ${active === f.value ? 'bg-um-accent text-um-black border-um-accent font-semibold' : 'border-white/10 text-white/55 hover:border-white/25 hover:text-white/80'}`}>
                {f.label}
              </Link>
            ))}
            <span className="ml-auto flex-shrink-0 text-white/25 text-xs font-mono">{treks.length} treks</span>
          </div>
          <input className="um-input text-sm !py-2.5" placeholder="🔍 Search treks by name or location..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <section className="py-14 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4].map(i => <div key={i} className="h-80 rounded-2xl bg-white/3 animate-pulse" />)}
            </div>
          ) : treks.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-5xl mb-4">🏔️</p>
              <p className="text-white/40 text-lg mb-2">No treks found.</p>
              <Link href="/trek" className="text-um-accent text-sm hover:text-um-warm transition-colors">Clear filters →</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {treks.map(trek => <TripCard key={trek._id} trip={trek} />)}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}

export default function Page() {
  return <Suspense fallback={<div className="min-h-screen bg-um-black flex items-center justify-center"><p className="text-um-beige font-mono animate-pulse">Loading...</p></div>}><Content /></Suspense>;
}
