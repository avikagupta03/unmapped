'use client';
import{useState,useEffect}from'react';
import Link from'next/link';

const SLIDES=[
  {img:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=85',label:'Himalayan Peaks'},
  {img:'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920&q=85',label:'Riverside Camps'},
  {img:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=85',label:'Coastal Mornings'},
  {img:'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1920&q=85',label:'Forest Trails'},
];
const MQ=['Weekend Trips','Himalayan Treks','Riverside Camps','Hidden Cafes','Bonfire Nights','Solo Escapes','Group Adventures','Mountain Roads'];
const WA=process.env.NEXT_PUBLIC_WA_NUMBER||'919999999999';

export default function Hero(){
  const[cur,setCur]=useState(0);
  const[rdy,setRdy]=useState(false);
  useEffect(()=>{setRdy(true);const t=setInterval(()=>setCur(c=>(c+1)%SLIDES.length),5500);return()=>clearInterval(t);},[]);
  return(
    <section className="relative h-screen min-h-[680px] flex flex-col overflow-hidden">
      {SLIDES.map((s,i)=><div key={i} className="absolute inset-0 bg-cover bg-center" style={{backgroundImage:`url(${s.img})`,opacity:i===cur?1:0,transition:'opacity 1.6s ease',zIndex:i===cur?1:0}}/>)}
      <div className="absolute inset-0 z-10" style={{background:'linear-gradient(180deg,rgba(10,10,10,0.6) 0%,rgba(10,10,10,0.05) 30%,rgba(10,10,10,0.5) 70%,rgba(10,10,10,0.98) 100%)'}}/>
      <div className="absolute inset-0 z-10" style={{background:'linear-gradient(90deg,rgba(10,10,10,0.55) 0%,transparent 55%)'}}/>

      <div className="relative z-20 flex-1 flex items-center pt-20">
        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-um-beige/20 bg-um-beige/5 mb-7 opacity-0 ${rdy?'fade-up':''}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/><span className="text-xs text-um-beige/75 font-mono uppercase tracking-widest">Bookings open · 2026</span>
            </div>
            <h1 className={`font-display font-black leading-none tracking-tighter mb-5 opacity-0 ${rdy?'fade-up delay-1':''}`} style={{fontSize:'clamp(2.5rem,5.5vw,5.5rem)'}}>
              <span className="block text-um-white">Escape</span>
              <span className="block italic text-um-beige">the ordinary.</span>
            </h1>
            <p className={`text-white/50 text-lg max-w-md leading-relaxed mb-9 opacity-0 ${rdy?'fade-up delay-2':''}`}>
              Curated weekend escapes — trekking, camping, hidden cafes, real people.<br/>
              <span className="text-um-beige/60 text-base">We plan. You escape.</span>
            </p>
            <div className={`flex flex-wrap gap-3 opacity-0 ${rdy?'fade-up delay-3':''}`}>
              <Link href="/trips" className="group inline-flex items-center gap-2 px-7 py-3.5 bg-um-accent text-um-black font-bold rounded-full hover:bg-um-warm transition-all duration-300 text-sm shadow-lg shadow-um-accent/20">
                Explore Trips <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </Link>
              <Link href="/trek" className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/15 text-um-white rounded-full hover:border-um-beige/40 hover:bg-white/5 transition-all duration-300 text-sm">🥾 Explore Treks</Link>
              <a href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-7 py-3.5 border border-green-500/25 text-green-300 rounded-full hover:bg-green-500/8 transition-all duration-300 text-sm">💬 WhatsApp Us</a>
            </div>
          </div>

          <div className={`lg:col-span-5 flex flex-col gap-3 opacity-0 ${rdy?'fade-up delay-4':''}`}>
            <div className="glass rounded-2xl px-5 py-4 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-um-accent flex-shrink-0 animate-pulse"/>
              <div className="flex-1"><p className="text-white/30 text-xs font-mono uppercase tracking-wider">Now viewing</p><p className="text-um-beige text-sm font-medium">{SLIDES[cur].label}</p></div>
              <div className="flex gap-1.5">{SLIDES.map((_,i)=><button key={i} onClick={()=>setCur(i)} className={`rounded-full transition-all duration-300 ${i===cur?'w-6 h-1.5 bg-um-accent':'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'}`}/>)}</div>
            </div>
            <div className="glass rounded-2xl px-5 py-5 grid grid-cols-3 divide-x divide-white/5">
              {[['500+','Travelers'],['30+','Trips Done'],['4.9★','Rated']].map(([n,l])=>(
                <div key={l} className="text-center px-3"><div className="font-display font-black text-2xl text-um-beige">{n}</div><div className="text-white/30 text-xs mt-0.5">{l}</div></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-20 border-t border-white/5 bg-um-black/70 backdrop-blur-sm py-3 overflow-hidden flex-shrink-0">
        <div className="flex gap-10 whitespace-nowrap marquee">
          {[...MQ,...MQ].map((item,i)=><span key={i} className="text-white/20 text-xs font-mono uppercase tracking-widest inline-flex items-center gap-10">{item}<span className="text-um-accent/30">✦</span></span>)}
        </div>
      </div>
    </section>
  );
}
