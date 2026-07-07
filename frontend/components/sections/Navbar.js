'use client';
import{useState,useEffect,useRef}from'react';
import Link from'next/link';
import{usePathname}from'next/navigation';
import{useAuth}from'../../context/AuthContext';

const TF=[{label:'⛰️ Hills & Mountains',href:'/trips?exp=hills'},{label:'🏖️ Beaches & Coastal',href:'/trips?exp=beaches'},{label:'🌲 Forests & Camping',href:'/trips?exp=forests'},{label:'🏜️ Desert & Plains',href:'/trips?exp=desert'}];
const TRF=[{label:'🟢 Easy Treks',href:'/trek?diff=easy'},{label:'🟡 Moderate Treks',href:'/trek?diff=moderate'},{label:'🔴 Challenging Treks',href:'/trek?diff=challenging'}];

export default function Navbar(){
  const[scrolled,setScrolled]=useState(false);
  const[mob,setMob]=useState(false);
  const[drop,setDrop]=useState(null);
  const[mobExp,setMobExp]=useState(null);
  const pathname=usePathname();
  const isHome=pathname==='/';
  const tRef=useRef(null);
  const{user}=useAuth();

  useEffect(()=>{const h=()=>setScrolled(window.scrollY>40);window.addEventListener('scroll',h);return()=>window.removeEventListener('scroll',h);},[]);
  useEffect(()=>{setMob(false);},[pathname]);

  const open=(n)=>{clearTimeout(tRef.current);setDrop(n);};
  const close=()=>{tRef.current=setTimeout(()=>setDrop(null),150);};

  return(
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled||mob?'bg-um-black/95 backdrop-blur-xl border-b border-white/5 py-3':'py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="font-display font-black text-2xl tracking-tighter text-um-white hover:text-um-beige transition-colors">unmapped</Link>

        <div className="hidden md:flex items-center gap-8">
          {/* Trips dropdown */}
          <div className="relative" onMouseEnter={()=>open('trips')} onMouseLeave={close}>
            <Link href="/trips" className={`flex items-center gap-1 text-sm tracking-wide transition-colors ${pathname.startsWith('/trips')?'text-um-beige':'text-white/60 hover:text-um-white'}`}>
              Trips
              <svg className={`w-3 h-3 transition-transform ${drop==='trips'?'rotate-180':''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </Link>
            {drop==='trips'&&(
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 glass rounded-2xl py-2 shadow-2xl" onMouseEnter={()=>open('trips')} onMouseLeave={close}>
                <p className="px-4 pt-1 pb-2 text-white/25 text-xs font-mono uppercase tracking-widest">By Experience</p>
                {TF.map(f=><Link key={f.href} href={f.href} className="flex items-center px-4 py-2.5 text-sm text-white/65 hover:text-um-beige hover:bg-white/4 transition-all">{f.label}</Link>)}
                <div className="mx-4 mt-1 pt-2 border-t border-white/5"><Link href="/trips" className="flex items-center py-2 text-xs text-um-accent hover:text-um-warm transition-colors">View all trips →</Link></div>
              </div>
            )}
          </div>

          {/* Trek dropdown */}
          <div className="relative" onMouseEnter={()=>open('trek')} onMouseLeave={close}>
            <Link href="/trek" className={`flex items-center gap-1 text-sm tracking-wide transition-colors ${pathname.startsWith('/trek')?'text-um-beige':'text-white/60 hover:text-um-white'}`}>
              Trek
              <svg className={`w-3 h-3 transition-transform ${drop==='trek'?'rotate-180':''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </Link>
            {drop==='trek'&&(
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-52 glass rounded-2xl py-2 shadow-2xl" onMouseEnter={()=>open('trek')} onMouseLeave={close}>
                <p className="px-4 pt-1 pb-2 text-white/25 text-xs font-mono uppercase tracking-widest">By Difficulty</p>
                {TRF.map(f=><Link key={f.href} href={f.href} className="flex items-center px-4 py-2.5 text-sm text-white/65 hover:text-um-beige hover:bg-white/4 transition-all">{f.label}</Link>)}
                <div className="mx-4 mt-1 pt-2 border-t border-white/5"><Link href="/trek" className="flex items-center py-2 text-xs text-um-accent hover:text-um-warm transition-colors">View all treks →</Link></div>
              </div>
            )}
          </div>

          <a href={isHome?'#about':'/#about'} className="text-sm text-white/60 hover:text-um-white tracking-wide transition-colors">About</a>

          {user?(
            <Link href="/profile" className="flex items-center gap-2 px-4 py-2 glass rounded-full border border-white/10 hover:border-um-beige/30 transition-all">
              <div className="w-6 h-6 rounded-full bg-um-accent/20 flex items-center justify-center text-xs text-um-accent font-bold">{user.name?.charAt(0).toUpperCase()}</div>
              <span className="text-sm text-white/70">{user.name?.split(' ')[0]}</span>
            </Link>
          ):(
            <Link href="/auth" className="text-sm text-white/60 hover:text-um-white tracking-wide transition-colors">Login</Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-1 flex flex-col gap-1.5" onClick={()=>setMob(o=>!o)}>
          <span className={`block w-6 h-0.5 bg-um-white transition-all duration-300 origin-center ${mob?'rotate-45 translate-y-2':''}`}/>
          <span className={`block w-6 h-0.5 bg-um-white transition-all duration-300 ${mob?'opacity-0':''}`}/>
          <span className={`block w-6 h-0.5 bg-um-white transition-all duration-300 origin-center ${mob?'-rotate-45 -translate-y-2':''}`}/>
        </button>
      </div>

      {/* Mobile menu */}
      {mob&&(
        <div className="md:hidden border-t border-white/5 mt-3 bg-um-black/98">
          <div className="px-6 py-4 space-y-1">
            <div>
              <button onClick={()=>setMobExp(e=>e==='trips'?null:'trips')} className="w-full flex items-center justify-between py-3 text-white/70 border-b border-white/5">
                Trips <svg className={`w-4 h-4 transition-transform ${mobExp==='trips'?'rotate-180':''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
              </button>
              {mobExp==='trips'&&<div className="py-2 pl-4 space-y-1">{TF.map(f=><Link key={f.href} href={f.href} className="block py-2 text-sm text-white/50 hover:text-um-beige transition-colors">{f.label}</Link>)}<Link href="/trips" className="block py-2 text-sm text-um-accent">All Trips →</Link></div>}
            </div>
            <div>
              <button onClick={()=>setMobExp(e=>e==='trek'?null:'trek')} className="w-full flex items-center justify-between py-3 text-white/70 border-b border-white/5">
                Trek <svg className={`w-4 h-4 transition-transform ${mobExp==='trek'?'rotate-180':''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
              </button>
              {mobExp==='trek'&&<div className="py-2 pl-4 space-y-1">{TRF.map(f=><Link key={f.href} href={f.href} className="block py-2 text-sm text-white/50 hover:text-um-beige transition-colors">{f.label}</Link>)}<Link href="/trek" className="block py-2 text-sm text-um-accent">All Treks →</Link></div>}
            </div>
            <a href={isHome?'#about':'/#about'} className="block py-3 text-white/70 border-b border-white/5">About</a>
            {user?<Link href="/profile" className="block py-3 text-white/70 border-b border-white/5">My Profile</Link>:<Link href="/auth" className="block py-3 text-white/70 border-b border-white/5">Login / Sign Up</Link>}
            <div className="pt-4 flex flex-col gap-3">
              <Link href="/trips" className="block w-full text-center py-3 bg-um-accent text-um-black font-semibold rounded-full text-sm">Explore Trips</Link>
              <Link href="/trek" className="block w-full text-center py-3 border border-white/10 text-white/60 rounded-full text-sm">Explore Treks</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
