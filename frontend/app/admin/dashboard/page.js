'use client';
import{useState,useEffect,useCallback}from'react';
import{useRouter}from'next/navigation';
import{getAllTrips,getInquiries,createTrip,updateTrip,deleteTrip,updateInquiry,adminLogout}from'../../../lib/api';
import axios from'axios';

const EMPTY={title:'',slug:'',description:'',type:'trip',image:'',location:'',duration:'',price:'',seatsAvailable:'',difficulty:'easy',experienceType:'hills',whoIsItFor:[],included:'',excluded:'',stayType:'',stayDescription:'',localTransport:'',importantNotes:'',vibeTags:'',isActive:true};
const SC={pending:'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',contacted:'text-blue-400 bg-blue-400/10 border-blue-400/20',confirmed:'text-green-400 bg-green-400/10 border-green-400/20'};

export default function Dashboard(){
  const[tab,setTab]=useState('trips');
  const[trips,setTrips]=useState([]);
  const[inquiries,setInquiries]=useState([]);
  const[loading,setLoading]=useState(true);
  const[modal,setModal]=useState(null);
  const[form,setForm]=useState(EMPTY);
  const[saving,setSaving]=useState(false);
  const[ferr,setFerr]=useState('');
  const[noteModal,setNoteModal]=useState(null);
  const[note,setNote]=useState('');
  const router=useRouter();

  const fetchAll=useCallback(async()=>{
    const token=localStorage.getItem('adminToken');
    if(!token){router.push('/admin/login');return;}
    axios.defaults.headers.common['Authorization']=`Bearer ${token}`;
    try{
      const[t,i]=await Promise.all([getAllTrips(),getInquiries()]);
      setTrips(t.data||[]);setInquiries(i.data||[]);
    }catch{router.push('/admin/login');}
    finally{setLoading(false);}
  },[router]);

  useEffect(()=>{fetchAll();},[fetchAll]);

  const openAdd=()=>{setForm(EMPTY);setModal('add');setFerr('');};
  const openEdit=(t)=>{
    setForm({...t,price:String(t.price),seatsAvailable:String(t.seatsAvailable),
      included:t.included?.join('\n')||'',excluded:t.excluded?.join('\n')||'',
      vibeTags:t.vibeTags?.join(', ')||'',whoIsItFor:t.whoIsItFor||[]});
    setModal(t);setFerr('');
  };
  const toggleWho=v=>setForm(f=>({...f,whoIsItFor:f.whoIsItFor.includes(v)?f.whoIsItFor.filter(x=>x!==v):[...f.whoIsItFor,v]}));

  const handleSave=async()=>{
    setSaving(true);setFerr('');
    try{
      const slug=form.slug||form.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
      const p={...form,slug,price:Number(form.price),seatsAvailable:Number(form.seatsAvailable),
        included:form.included.split('\n').map(s=>s.trim()).filter(Boolean),
        excluded:form.excluded.split('\n').map(s=>s.trim()).filter(Boolean),
        vibeTags:form.vibeTags.split(',').map(s=>s.trim()).filter(Boolean)};
      if(modal==='add')await createTrip(p);else await updateTrip(modal._id,p);
      setModal(null);fetchAll();
    }catch(e){setFerr(e.response?.data?.message||'Failed to save.');}
    finally{setSaving(false);}
  };

  const handleDelete=async(id)=>{if(!confirm('Delete this trip?'))return;try{await deleteTrip(id);fetchAll();}catch{alert('Delete failed.');}};
  const handleStatus=async(id,status)=>{try{await updateInquiry(id,{status});fetchAll();}catch{}};
  const handleNote=async()=>{try{await updateInquiry(noteModal._id,{adminNote:note});setNoteModal(null);fetchAll();}catch{}};
  const handleLogout=async()=>{try{await adminLogout();}catch{}localStorage.removeItem('adminToken');router.push('/admin/login');};

  const stats=[[trips.filter(t=>t.type==='trip').length,'Trips','🏕️'],[trips.filter(t=>t.type==='trek').length,'Treks','🥾'],[inquiries.length,'Inquiries','📩'],[inquiries.filter(i=>i.status==='pending').length,'Pending','⏳']];

  if(loading)return<div className="min-h-screen bg-um-black flex items-center justify-center"><p className="text-um-beige font-mono animate-pulse">Loading...</p></div>;

  return(
    <div className="min-h-screen bg-um-black">
      <header className="bg-um-charcoal border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3"><h1 className="font-display font-black text-xl text-um-white">unmapped</h1><span className="text-white/20">·</span><span className="text-white/35 text-sm font-mono">Admin</span></div>
        <div className="flex items-center gap-4">
          <a href="/" target="_blank" className="text-white/35 hover:text-um-beige text-sm transition-colors">View site →</a>
          <button onClick={handleLogout} className="px-4 py-2 border border-white/10 text-white/50 text-sm rounded-lg hover:bg-white/5 transition-all">Logout</button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map(([v,l,ic])=>(
            <div key={l} className="glass rounded-2xl p-5 flex items-center justify-between">
              <div><p className="text-white/35 text-xs uppercase tracking-wider mb-1">{l}</p><p className="font-display font-black text-3xl text-um-white">{v}</p></div>
              <span className="text-2xl opacity-60">{ic}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-1 mb-6 bg-um-charcoal rounded-xl p-1 w-fit">
          {['trips','inquiries'].map(t=><button key={t} onClick={()=>setTab(t)} className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${tab===t?'bg-um-accent text-um-black':'text-white/45 hover:text-white/70'}`}>{t}</button>)}
        </div>

        {tab==='trips'&&(
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-lg text-um-white">Trips & Treks</h2>
              <button onClick={openAdd} className="px-4 py-2 bg-um-accent text-um-black text-sm font-bold rounded-lg hover:bg-um-warm transition-all">+ Add New</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trips.map(trip=>(
                <div key={trip._id} className="glass rounded-2xl overflow-hidden group">
                  <div className="relative h-36 overflow-hidden">
                    <img src={trip.image} alt={trip.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-um-black/80 to-transparent"/>
                    <div className="absolute bottom-2 left-3 flex gap-1.5">
                      <span className={`px-2 py-0.5 text-xs rounded-full border ${trip.type==='trek'?'bg-blue-500/20 text-blue-300 border-blue-500/25':'bg-um-accent/20 text-um-accent border-um-accent/25'}`}>{trip.type}</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full border ${trip.isActive?'bg-green-500/20 text-green-300 border-green-500/25':'bg-red-500/20 text-red-300 border-red-500/25'}`}>{trip.isActive?'Active':'Inactive'}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-um-white font-semibold text-sm mb-1 truncate">{trip.title}</h3>
                    <p className="text-white/35 text-xs mb-3">{trip.location} · {trip.duration}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-um-beige">Rs{trip.price?.toLocaleString()}</span>
                      <div className="flex gap-2">
                        <button onClick={()=>openEdit(trip)} className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/60 text-xs rounded-lg hover:bg-white/10 transition-all">Edit</button>
                        <button onClick={()=>handleDelete(trip._id)} className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg hover:bg-red-500/20 transition-all">Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==='inquiries'&&(
          <div>
            <h2 className="font-display font-bold text-lg text-um-white mb-5">Booking Inquiries</h2>
            {inquiries.length===0?<p className="text-white/30 text-sm">No inquiries yet.</p>:(
              <div className="space-y-3">
                {inquiries.map(inq=>(
                  <div key={inq._id} className="glass rounded-2xl p-5">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className="text-um-white font-semibold">{inq.userName}</span>
                          <span className={`px-2.5 py-0.5 text-xs rounded-full border capitalize font-mono ${SC[inq.status]}`}>{inq.status}</span>
                          {inq.travelType&&<span className="text-white/30 text-xs capitalize">{inq.travelType}</span>}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1 text-xs text-white/40 mb-2">
                          <span>📞 {inq.phone}</span><span>✉️ {inq.email}</span>
                          <span>🏕️ {inq.selectedTrip}</span><span>👥 {inq.travelers} traveler{inq.travelers>1?'s':''}</span>
                          {inq.budget&&<span>💰 {inq.budget}</span>}{inq.preferredDate&&<span>📅 {inq.preferredDate}</span>}
                        </div>
                        {inq.specialNeeds?.length>0&&<div className="flex flex-wrap gap-1 mb-2">{inq.specialNeeds.map(n=><span key={n} className="px-2 py-0.5 text-xs rounded-full bg-white/5 text-white/35 border border-white/8">{n}</span>)}</div>}
                        {inq.message&&<p className="text-white/30 text-xs italic">"{inq.message}"</p>}
                        {inq.adminNote&&<p className="text-um-beige/70 text-xs mt-1">Note: {inq.adminNote}</p>}
                        <p className="text-white/20 text-xs mt-1">{new Date(inq.createdAt).toLocaleString('en-IN',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 flex-shrink-0">
                        {['pending','contacted','confirmed'].map(s=><button key={s} onClick={()=>handleStatus(inq._id,s)} className={`px-3 py-1.5 text-xs rounded-lg border transition-all capitalize ${inq.status===s?'bg-um-accent text-um-black border-um-accent':'bg-white/4 border-white/10 text-white/45 hover:bg-white/8'}`}>{s}</button>)}
                        <a href={`https://wa.me/${inq.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-xs rounded-lg bg-green-600/10 border border-green-500/20 text-green-400 hover:bg-green-600/20 transition-all">💬 WA</a>
                        <button onClick={()=>{setNoteModal(inq);setNote(inq.adminNote||'');}} className="px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 transition-all">📝 Note</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Trip Modal */}
      {modal!==null&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={()=>setModal(null)}/>
          <div className="relative glass rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl">
            <div className="sticky top-0 glass rounded-t-3xl px-6 py-5 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-um-white">{modal==='add'?'Add New':'Edit Trip'}</h3>
              <button onClick={()=>setModal(null)} className="w-8 h-8 rounded-full bg-white/5 text-white/50 hover:text-white flex items-center justify-center text-xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {['trip','trek'].map(t=><button key={t} type="button" onClick={()=>setForm(f=>({...f,type:t}))} className={`py-3 rounded-xl border text-sm font-medium capitalize transition-all ${form.type===t?'border-um-accent bg-um-accent/10 text-um-beige':'border-white/10 bg-white/3 text-white/45 hover:border-white/20'}`}>{t==='trip'?'🏕️ Trip':'🥾 Trek'}</button>)}
              </div>
              {[['title','Title *'],['image','Image URL *'],['location','Location *'],['duration','Duration *']].map(([n,l])=>(
                <div key={n}><label className="block text-white/35 text-xs uppercase tracking-wider mb-1.5">{l}</label><input value={form[n]} onChange={e=>setForm(f=>({...f,[n]:e.target.value}))} className="um-input"/></div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-white/35 text-xs uppercase tracking-wider mb-1.5">Price *</label><input type="number" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} className="um-input"/></div>
                <div><label className="block text-white/35 text-xs uppercase tracking-wider mb-1.5">Seats *</label><input type="number" value={form.seatsAvailable} onChange={e=>setForm(f=>({...f,seatsAvailable:e.target.value}))} className="um-input"/></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-white/35 text-xs uppercase tracking-wider mb-1.5">Experience</label><select value={form.experienceType} onChange={e=>setForm(f=>({...f,experienceType:e.target.value}))} className="um-input" style={{background:'#1c1c1c'}}>{['hills','beaches','forests','desert','culture'].map(v=><option key={v} value={v}>{v}</option>)}</select></div>
                <div><label className="block text-white/35 text-xs uppercase tracking-wider mb-1.5">Difficulty</label><select value={form.difficulty} onChange={e=>setForm(f=>({...f,difficulty:e.target.value}))} className="um-input" style={{background:'#1c1c1c'}}>{['easy','moderate','challenging','high-altitude'].map(v=><option key={v} value={v}>{v}</option>)}</select></div>
              </div>
              <div><label className="block text-white/35 text-xs uppercase tracking-wider mb-2">Who is it for?</label><div className="flex gap-2 flex-wrap">{['solo','group','family','couple'].map(w=><button key={w} type="button" onClick={()=>toggleWho(w)} className={`px-3 py-1.5 rounded-lg text-xs border transition-all capitalize ${form.whoIsItFor.includes(w)?'border-um-accent bg-um-accent/10 text-um-beige':'border-white/10 bg-white/3 text-white/45 hover:border-white/20'}`}>{w}</button>)}</div></div>
              <div><label className="block text-white/35 text-xs uppercase tracking-wider mb-1.5">Description *</label><textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={3} className="um-input resize-none"/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-white/35 text-xs uppercase tracking-wider mb-1.5">Included (one per line)</label><textarea value={form.included} onChange={e=>setForm(f=>({...f,included:e.target.value}))} rows={4} className="um-input resize-none text-xs" placeholder="Transport&#10;Accommodation&#10;Meals"/></div>
                <div><label className="block text-white/35 text-xs uppercase tracking-wider mb-1.5">Excluded (one per line)</label><textarea value={form.excluded} onChange={e=>setForm(f=>({...f,excluded:e.target.value}))} rows={4} className="um-input resize-none text-xs" placeholder="Travel expenses&#10;Insurance"/></div>
              </div>
              {[['stayType','Stay Type'],['stayDescription','Stay Description'],['localTransport','Getting There'],['importantNotes','Important Notes'],['vibeTags','Vibe Tags (comma separated)']].map(([n,l])=>(
                <div key={n}><label className="block text-white/35 text-xs uppercase tracking-wider mb-1.5">{l}</label><input value={form[n]} onChange={e=>setForm(f=>({...f,[n]:e.target.value}))} className="um-input"/></div>
              ))}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/8">
                <span className="text-white/50 text-sm">Active (visible on site)</span>
                <button type="button" onClick={()=>setForm(f=>({...f,isActive:!f.isActive}))} className={`w-11 h-6 rounded-full transition-all duration-300 relative ${form.isActive?'bg-um-accent':'bg-white/15'}`}><span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${form.isActive?'left-6':'left-1'}`}/></button>
              </div>
              {ferr&&<p className="text-red-400 text-sm">{ferr}</p>}
              <div className="flex gap-3 pt-2">
                <button onClick={()=>setModal(null)} className="flex-1 py-3 border border-white/10 text-white/50 rounded-xl hover:bg-white/5 transition-all text-sm">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-um-accent text-um-black font-bold rounded-xl hover:bg-um-warm transition-all text-sm disabled:opacity-50">{saving?'Saving...':modal==='add'?'Create':'Save Changes'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Note Modal */}
      {noteModal&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={()=>setNoteModal(null)}/>
          <div className="relative glass rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="font-display font-bold text-lg text-um-white mb-4">Add Note for {noteModal.userName}</h3>
            <textarea className="um-input resize-none mb-4" rows={4} placeholder="e.g. Called and confirmed. Sending itinerary tomorrow." value={note} onChange={e=>setNote(e.target.value)}/>
            <div className="flex gap-3">
              <button onClick={()=>setNoteModal(null)} className="flex-1 py-3 border border-white/10 text-white/50 rounded-xl hover:bg-white/5 transition-all text-sm">Cancel</button>
              <button onClick={handleNote} className="flex-1 py-3 bg-um-accent text-um-black font-bold rounded-xl hover:bg-um-warm transition-all text-sm">Save Note</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
