'use client';
import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { saveTrip } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const DIFF={easy:'bg-green-500/15 text-green-300 border-green-500/25',moderate:'bg-yellow-500/15 text-yellow-300 border-yellow-500/25',challenging:'bg-orange-500/15 text-orange-300 border-orange-500/25','high-altitude':'bg-red-500/15 text-red-300 border-red-500/25'};
const EXP={hills:'⛰️ Hills',beaches:'🏖️ Beaches',forests:'🌲 Forests',desert:'🏜️ Desert',culture:'☕ Culture'};
const WHO={solo:'🧍 Solo',family:'👨‍👩‍👧 Family',group:'🎒 Group',couple:'💑 Couple'};

export default function TripCard({trip}){
  const isLow=trip.seatsAvailable<=5;
  const url=`/${trip.type==='trek'?'trek':'trips'}/${trip.slug}`;
  const {user}=useAuth();
  const [saved,setSaved]=useState(user?.savedTrips?.map(t=>t._id||t)?.includes(trip._id)||false);
  const [saving,setSaving]=useState(false);

  const handleSave=async(e)=>{
    e.preventDefault();
    e.stopPropagation();
    if(!user){toast.error('Login to save trips!');return;}
    setSaving(true);
    try{
      const res=await saveTrip(trip._id);
      setSaved(res.data.saved);
      toast.success(res.data.saved?'Trip saved! ❤️':'Removed from saved');
    }catch{toast.error('Failed to save.');}
    finally{setSaving(false);}
  };
  return(
    <Link href={url} className="group block glass rounded-2xl overflow-hidden card-hover">
      <div className="relative h-44 overflow-hidden">
        <img src={trip.image} alt={trip.title} className="w-full h-full object-cover img-zoom"/>
        <div className="absolute inset-0" style={{background:'linear-gradient(to top,rgba(10,10,10,0.92) 0%,rgba(10,10,10,0.1) 55%,transparent 100%)'}}/>
        <div className="absolute top-3 left-3">
          {trip.type==='trek'?(
            <span className={`px-2.5 py-1 text-xs rounded-full border font-medium ${DIFF[trip.difficulty]||DIFF.easy}`}>{trip.difficulty?.charAt(0).toUpperCase()+trip.difficulty?.slice(1)}</span>
          ):(
            <span className="px-2.5 py-1 text-xs rounded-full bg-um-beige/15 text-um-beige border border-um-beige/25 font-medium">{EXP[trip.experienceType]||'🗺️ Trip'}</span>
          )}
        </div>
        {isLow&&<div className="absolute top-3 right-3"><span className="px-2.5 py-1 text-xs rounded-full bg-red-500/15 text-red-300 border border-red-500/25">🔥 {trip.seatsAvailable} left</span></div>}
        {/* Save button */}
        <button onClick={handleSave} disabled={saving}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isLow?'top-10':'top-3'} ${saved?'bg-red-500/30 text-red-300 border border-red-400/40':'bg-black/40 backdrop-blur-sm text-white/50 border border-white/10 hover:text-red-300 hover:border-red-400/40'}`}
          style={{top: isLow ? '2.5rem' : '0.75rem'}}>
          {saved?'❤️':'🤍'}
        </button>
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          {trip.whoIsItFor?.slice(0,2).map(w=><span key={w} className="px-2 py-0.5 text-xs rounded-full bg-black/50 backdrop-blur-sm text-white/65 border border-white/10">{WHO[w]||w}</span>)}
        </div>
      </div>
      <div className="p-5">
        <p className="text-um-accent/70 text-xs font-mono uppercase tracking-wider mb-1 flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-um-accent/50 inline-block"/>{trip.location}</p>
        <h3 className="font-display font-bold text-lg text-um-white leading-snug mb-2 group-hover:text-um-beige transition-colors duration-300">{trip.title}</h3>
        <p className="text-white/40 text-sm leading-relaxed mb-4 line-clamp-2">{trip.description}</p>
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div><div className="font-display font-bold text-2xl text-um-beige">₹{trip.price?.toLocaleString()}</div><div className="text-white/30 text-xs">{trip.duration} · per person</div></div>
          <span className="px-4 py-2 bg-um-accent text-um-black text-xs font-bold rounded-full group-hover:bg-um-warm transition-all duration-300">View Trip →</span>
        </div>
      </div>
    </Link>
  );
}
