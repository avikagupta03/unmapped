'use client';
import{useState}from'react';
import toast from'react-hot-toast';
import{submitInquiry}from'../../lib/api';
import{useAuth}from'../../context/AuthContext';

const WA=process.env.NEXT_PUBLIC_WA_NUMBER||'919999999999';
const PHONE=process.env.NEXT_PUBLIC_PHONE||'+91 99999 99999';
const BUDGETS=['Under ₹5,000','₹5,000–₹10,000','₹10,000–₹20,000','₹20,000+','Flexible'];
const NEEDS=['Vegetarian meals','Women-only group','First-time traveler','Child under 10','Wheelchair accessible'];
const TYPES=[{value:'solo',label:'🧍 Solo'},{value:'couple',label:'💑 Couple'},{value:'group',label:'🎒 Group'},{value:'family',label:'👨‍👩‍👧 Family'}];

export default function BookingModal({trip,onClose}){
  const{user}=useAuth();
  const[form,setForm]=useState({userName:user?.name||'',email:user?.email||'',phone:'',selectedTrip:trip?.title||'',travelers:1,travelType:'',budget:'',preferredDate:'',specialNeeds:[],message:''});
  const[status,setStatus]=useState(null);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const toggle=n=>setForm(f=>({...f,specialNeeds:f.specialNeeds.includes(n)?f.specialNeeds.filter(x=>x!==n):[...f.specialNeeds,n]}));
  const waMsg=encodeURIComponent(`Hi unmapped! 👋\n\nInterested in: ${form.selectedTrip}\nName: ${form.userName}\nTravelers: ${form.travelers}\nDate: ${form.preferredDate||'Flexible'}\nBudget: ${form.budget||'Flexible'}`);

  const handleSubmit=async(e)=>{
    e.preventDefault();
    setStatus('loading');
    try{
      await submitInquiry(form);
      setStatus('success');
      toast.success('Inquiry sent! We will contact you within 24 hours 🏔️');
    }catch(err){
      toast.error(err.response?.data?.message||'Something went wrong.');
      setStatus(null);
    }
  };

  return(
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative glass rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl">
        <div className="sticky top-0 glass rounded-t-3xl px-6 py-5 flex items-center justify-between border-b border-white/5 z-10">
          <div><h3 className="font-display font-bold text-lg text-um-white">Book Your Escape</h3>{trip&&<p className="text-um-accent text-xs font-mono mt-0.5">{trip.title}</p>}</div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all text-xl">×</button>
        </div>

        {status==='success'?(
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-um-accent/15 border border-um-accent/30 flex items-center justify-center text-3xl mx-auto mb-5">🏔️</div>
            <h4 className="font-display font-bold text-xl text-um-white mb-2">You are on the list!</h4>
            <p className="text-white/50 text-sm mb-1">Our team will reach out within <span className="text-um-beige">24 hours</span>.</p>
            <p className="text-white/30 text-xs mb-6">Check your email for confirmation.</p>
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <a href={`https://wa.me/${WA}?text=${waMsg}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3.5 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-500 transition-all text-sm">💬 WhatsApp Us Now</a>
              <a href={`tel:${PHONE}`} className="flex items-center justify-center gap-2 py-3.5 border border-white/10 text-white/70 rounded-2xl hover:bg-white/5 transition-all text-sm">📞 {PHONE}</a>
              <button onClick={onClose} className="py-3 text-white/30 hover:text-white/50 text-sm transition-colors">Close</button>
            </div>
          </div>
        ):(
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <input className="um-input" placeholder="Full name *" value={form.userName} onChange={e=>set('userName',e.target.value)} required/>
            <input className="um-input" placeholder="Phone number (with country code) *" type="tel" value={form.phone} onChange={e=>set('phone',e.target.value)} required/>
            <input className="um-input" placeholder="Email address *" type="email" value={form.email} onChange={e=>set('email',e.target.value)} required/>
            <div className="border-t border-white/5 pt-4">
              <input className="um-input mb-3" placeholder="Which trip? *" value={form.selectedTrip} onChange={e=>set('selectedTrip',e.target.value)} required/>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {TYPES.map(t=><button key={t.value} type="button" onClick={()=>set('travelType',t.value)} className={`py-2.5 rounded-xl text-xs border transition-all ${form.travelType===t.value?'border-um-accent bg-um-accent/10 text-um-beige':'border-white/8 bg-white/3 text-white/45 hover:border-white/15'}`}>{t.label}</button>)}
              </div>
              <div className="flex items-center gap-4 mb-3">
                <span className="text-white/40 text-sm flex-shrink-0">Travelers:</span>
                <button type="button" onClick={()=>set('travelers',Math.max(1,form.travelers-1))} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 transition-all font-bold">−</button>
                <span className="font-display font-bold text-xl text-um-white w-8 text-center">{form.travelers}</span>
                <button type="button" onClick={()=>set('travelers',Math.min(20,form.travelers+1))} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 transition-all font-bold">+</button>
              </div>
              <input type="month" className="um-input mb-3" value={form.preferredDate} onChange={e=>set('preferredDate',e.target.value)}/>
              <div className="flex flex-wrap gap-2 mb-3">{BUDGETS.map(b=><button key={b} type="button" onClick={()=>set('budget',b)} className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${form.budget===b?'border-um-accent bg-um-accent/10 text-um-beige':'border-white/8 bg-white/3 text-white/45 hover:border-white/15'}`}>{b}</button>)}</div>
              <div className="flex flex-wrap gap-2 mb-3">{NEEDS.map(n=><button key={n} type="button" onClick={()=>toggle(n)} className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${form.specialNeeds.includes(n)?'border-um-accent bg-um-accent/10 text-um-beige':'border-white/8 bg-white/3 text-white/45 hover:border-white/15'}`}>{form.specialNeeds.includes(n)?'✓ ':''}{n}</button>)}</div>
              <textarea className="um-input resize-none" rows={2} placeholder="Any questions or notes..." value={form.message} onChange={e=>set('message',e.target.value)}/>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/5 border border-green-500/15">
              <span>💬</span>
              <p className="flex-1 text-white/35 text-xs">Prefer WhatsApp? <a href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 underline">Chat directly</a></p>
            </div>
            <button type="submit" disabled={status==='loading'} className="w-full py-4 bg-um-accent text-um-black font-bold rounded-2xl hover:bg-um-warm transition-all text-sm disabled:opacity-50">
              {status==='loading'?'Sending...':'Send Inquiry →'}
            </button>
            <p className="text-white/20 text-xs text-center">No payment required. Confirmation email sent automatically.</p>
          </form>
        )}
      </div>
    </div>
  );
}
