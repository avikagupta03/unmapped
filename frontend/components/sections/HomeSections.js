'use client';
import Link from 'next/link';
import TripCard from '../shared/TripCard';
import{useState,useEffect}from'react';
import{getTrips}from'../../lib/api';
import{useAuth}from'../../context/AuthContext';

const WA=process.env.NEXT_PUBLIC_WA_NUMBER||'919999999999';
const PHONE=process.env.NEXT_PUBLIC_PHONE||'+91 99999 99999';
const IG=process.env.NEXT_PUBLIC_INSTAGRAM||'https://instagram.com/unmapped.in';

// WHAT WE DO — no Stays, replaced with Community
export function WhatWeDo(){
  const items=[
    {icon:'🏕️',title:'Trips',desc:'Weekend escapes to hills, beaches, forests and hidden corners of India.'},
    {icon:'🥾',title:'Treks',desc:'From easy trails to high-altitude Himalayan expeditions.'},
    {icon:'👥',title:'Community',desc:'Meet like-minded travelers. Strangers become your best travel crew.'},
    {icon:'🔥',title:'Memories',desc:'Bonfires, real conversations, and weekends you actually talk about.'},
  ];
  return(
    <section className="py-20 px-6 bg-um-charcoal border-y border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {items.map((item,i)=>(
          <div key={i} className="text-center group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
            <h3 className="font-display font-bold text-xl text-um-white mb-2">{item.title}</h3>
            <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ABOUT — proper brand story
export function About(){
  return(
    <section id="about" className="py-28 px-6 bg-um-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{backgroundImage:'radial-gradient(circle at 20% 50%, #c8b59a 0%, transparent 60%)'}}/>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left — image */}
        <div className="relative rounded-3xl overflow-hidden h-86 lg:h-[500px]">
          <img src="https://plus.unsplash.com/premium_photo-1705563088246-3673a401ed6a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="unmapped story" className="w-full h-full object-cover"/>
          <div className="absolute inset-0" style={{background:'linear-gradient(135deg,rgba(10,10,10,0.4) 0%,rgba(10,10,10,0.1) 100%)'}}/>
          <div className="absolute bottom-6 left-6">
            <span className="px-4 py-2 glass rounded-full text-um-white text-xs font-mono uppercase tracking-widest">Est. 2024 · India</span>
          </div>
        </div>

        {/* Right — story */}
        <div>
          <p className="text-um-accent text-xs font-mono uppercase tracking-widest mb-4">Our Story</p>
          <h2 className="font-display font-black text-4xl md:text-5xl text-um-white leading-tight mb-6">
            Why we built<br/><span className="italic text-um-beige">unmapped.</span>
          </h2>
          <div className="space-y-4 text-white/55 leading-relaxed text-sm">
            <p>
              We were tired of the same algorithm-fed destinations, overpriced tour packages, and group trips that felt like herding cattle through a checklist.
            </p>
            <p>
              unmapped was built for the people who want to <span className="text-um-beige">actually escape</span> — not just post about it. People who want to wake up somewhere that doesn't feel like a hotel lobby, eat food that doesn't have a QR code menu, and meet people they'll actually stay in touch with.
            </p>
            <p>
              Every trip we curate is intentional. The stays, the routes, the timing, the group size — all of it is designed around one question: <span className="text-um-beige">does this actually feel like an escape?</span>
            </p>
            <p>
              We are a small team of travelers who got tired of waiting for the perfect trip and started building it instead.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/8">
            {[['500+','Travelers'],['22','Curated Trips'],['4.9★','Avg Rating']].map(([n,l])=>(
              <div key={l}>
                <div className="font-display font-black text-2xl text-um-beige">{n}</div>
                <div className="text-white/35 text-xs mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// FEATURED SECTION
export function FeaturedSection({type}){
  const[items,setItems]=useState([]);
  const[loading,setLoading]=useState(true);
  const isTrek=type==='trek';
  useEffect(()=>{getTrips({type}).then(r=>setItems(r.data?.slice(0,3)||[])).catch(()=>{}).finally(()=>setLoading(false));},[type]);
  return(
    <section className={`py-24 px-6 ${isTrek?'bg-um-charcoal':'bg-um-black'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-um-accent text-xs font-mono uppercase tracking-widest mb-3">{isTrek?'Featured Treks':'Featured Trips'}</p>
            <h2 className="font-display font-black text-4xl md:text-5xl text-um-white leading-tight">
              {isTrek?<>The trail<br/><span className="italic text-um-beige">awaits.</span></>:<>This weekend,<br/><span className="italic text-um-beige">go somewhere.</span></>}
            </h2>
          </div>
          <Link href={isTrek?'/trek':'/trips'} className="hidden md:inline-flex items-center gap-2 text-sm text-um-beige hover:text-um-warm transition-colors border-b border-um-beige/30 pb-0.5">
            View all {isTrek?'treks':'trips'} →
          </Link>
        </div>
        {loading?(
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{[1,2,3].map(i=><div key={i} className="h-80 rounded-2xl bg-white/3 animate-pulse"/>)}</div>
        ):(
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{items.map(trip=><TripCard key={trip._id} trip={trip}/>)}</div>
        )}
        <div className="text-center mt-8 md:hidden">
          <Link href={isTrek?'/trek':'/trips'} className="inline-flex items-center gap-2 px-6 py-3 border border-white/10 text-white/60 rounded-full hover:border-um-beige hover:text-um-beige transition-all text-sm">
            View all {isTrek?'treks':'trips'} →
          </Link>
        </div>
      </div>
    </section>
  );
}

// HOW IT WORKS
export function HowItWorks(){
  const steps=[
    {num:'01',title:'Pick your escape',desc:'Browse trips and treks by experience or difficulty. Every listing has everything you need to decide.'},
    {num:'02',title:'Send an inquiry',desc:'Fill a quick form or WhatsApp us. No payment now — just a conversation to confirm your spot.'},
    {num:'03',title:'We handle everything',desc:'Transport, stays, guides, and logistics. You just show up. We take care of the rest.'},
  ];
  return(
    <section className="py-24 px-6 bg-um-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-um-accent text-xs font-mono uppercase tracking-widest mb-3">How it works</p>
          <h2 className="font-display font-black text-4xl md:text-5xl text-um-white">Simple as it gets.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((s,i)=>(
            <div key={i}>
              <div className="w-14 h-14 rounded-2xl glass-warm border border-um-beige/15 flex items-center justify-center mb-5">
                <span className="font-display font-black text-xl text-um-beige">{s.num}</span>
              </div>
              <h3 className="font-display font-bold text-xl text-um-white mb-3">{s.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// TESTIMONIALS — with conditional feedback button
export function Testimonials(){
  const{user}=useAuth();
  const reviews=[
    {name:'Priya S.',city:'Mumbai',trip:'Kasol Camp Weekend',stars:5,text:'Met my best travel crew here. We have done 3 more trips since. unmapped literally changed my weekends.'},
    {name:'Aditya K.',city:'Delhi',trip:'Triund Night Trek',stars:5,text:'Woke up at 4am for the sunrise and nearly cried. The guide, camp, people — everything was perfect.'},
    {name:'Shreya M.',city:'Bangalore',trip:'Bir Billing Escape',stars:4,text:'First solo trip ever. Joined as a stranger, left with 14 new friends and stories I keep telling.'},
  ];

  // Show feedback button only if any review has rating >= 4
  const showFeedback = reviews.some(r => r.stars >= 4);

  return(
    <section className="py-24 px-6 bg-um-charcoal">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-um-accent text-xs font-mono uppercase tracking-widest mb-3">Real travelers</p>
          <h2 className="font-display font-black text-4xl md:text-5xl text-um-white">Stories from the trail.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {reviews.map((r,i)=>(
            <div key={i} className="glass rounded-2xl p-6 hover:bg-white/4 transition-all duration-300">
              <div className="flex gap-0.5 mb-4">
                {Array(r.stars).fill(0).map((_,j)=><span key={j} className="text-um-accent text-sm">★</span>)}
                {Array(5-r.stars).fill(0).map((_,j)=><span key={j} className="text-white/15 text-sm">★</span>)}
              </div>
              <p className="text-white/65 text-sm leading-relaxed mb-5 italic">"{r.text}"</p>
              <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                <div><p className="text-um-white font-semibold text-sm">{r.name}</p><p className="text-white/30 text-xs">{r.city}</p></div>
                <span className="text-xs text-um-accent/60 font-mono text-right">{r.trip}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Conditional feedback button — only shows when rating >= 4 */}
        {showFeedback && (
          <div className="flex justify-center">
            <a
              href={`https://wa.me/${WA}?text=${encodeURIComponent('Hi unmapped! I recently went on a trip and wanted to share my feedback 😊')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3 glass border border-um-beige/20 text-um-beige rounded-full hover:bg-um-beige/8 hover:border-um-beige/40 transition-all duration-300 text-sm"
            >
              <span>💬</span>
              Share your experience with us →
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

// CTA BANNER — removed "Browse Trips" button, kept only WhatsApp
export function CTABanner(){
  return(
    <section className="py-24 px-6 bg-um-black relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{backgroundImage:'url(https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920)'}}/>
      <div className="absolute inset-0 bg-gradient-to-t from-um-black via-um-black/80 to-um-black"/>
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <p className="text-um-accent text-xs font-mono uppercase tracking-widest mb-4">Ready?</p>
        <h2 className="font-display font-black text-5xl md:text-6xl text-um-white mb-4 leading-tight">
          Your next weekend<br/><span className="italic text-um-beige">starts here.</span>
        </h2>
        <p className="text-white/45 mb-10 text-lg">Pick a trip, send an inquiry, and let us handle the rest.</p>
        <div className="flex justify-center">
          <a href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer"
            className="px-8 py-4 bg-green-600 text-white font-bold rounded-full hover:bg-green-500 transition-all text-sm flex items-center gap-2 shadow-lg shadow-green-900/30">
            💬 WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  );
}

// FOOTER
export function Footer(){
  return(
    <footer className="bg-um-charcoal border-t border-white/5 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
        <div className="md:col-span-2">
          <h3 className="font-display font-black text-3xl text-um-white mb-2">unmapped</h3>
          <p className="text-um-accent text-xs font-mono uppercase tracking-widest mb-4">Escape the ordinary.</p>
          <p className="text-white/35 text-sm leading-relaxed max-w-xs">Curated weekend escapes for the next generation of travelers. We plan everything — you just show up.</p>
          <div className="flex gap-3 mt-5">
            <a href={IG} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:border-pink-400/50 hover:text-pink-300 transition-all text-xs font-bold">IG</a>
            <a href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:border-green-400/50 hover:text-green-300 transition-all text-xs font-bold">WA</a>
          </div>
        </div>
        <div>
          <h4 className="text-white/40 text-xs uppercase tracking-widest mb-4 font-mono">Explore</h4>
          <div className="space-y-2.5">
            {[['All Trips','/trips'],['Hills & Mountains','/trips?exp=hills'],['Beaches & Coastal','/trips?exp=beaches'],['Forests & Camping','/trips?exp=forests'],['All Treks','/trek'],['Easy Treks','/trek?diff=easy']].map(([l,h])=>(
              <Link key={l} href={h} className="block text-white/35 hover:text-um-beige text-sm transition-colors">{l}</Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-white/40 text-xs uppercase tracking-widest mb-4 font-mono">Contact</h4>
          <div className="space-y-2.5">
            <a href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer" className="block text-white/35 hover:text-green-400 text-sm transition-colors">💬 WhatsApp</a>
            <a href={`tel:${PHONE}`} className="block text-white/35 hover:text-um-beige text-sm transition-colors">📞 {PHONE}</a>
            <a href="mailto:hello@unmapped.in" className="block text-white/35 hover:text-um-beige text-sm transition-colors">✉️ hello@unmapped.in</a>
            <a href={IG} target="_blank" rel="noopener noreferrer" className="block text-white/35 hover:text-pink-400 text-sm transition-colors">📸 @unmapped.in</a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-white/20 text-xs">© 2026 unmapped. All rights reserved.</p>
        <p className="text-white/15 text-xs">Made for the <span className="text-um-beige/30">adventurous</span> soul 🏕️</p>
        <Link href="/admin/login" className="text-white/10 hover:text-white/25 text-xs transition-colors">Admin</Link>
      </div>
    </footer>
  );
}
