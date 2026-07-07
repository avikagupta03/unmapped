'use client';
import{useState,useEffect}from'react';
import Link from'next/link';
import{useParams}from'next/navigation';
import Navbar from'../../../components/sections/Navbar';
import{Footer}from'../../../components/sections/HomeSections';
import BookingModal from'../../../components/shared/BookingModal';
import{getTripBySlug,getReviews,addReview}from'../../../lib/api';
import{useAuth}from'../../../context/AuthContext';
import toast from'react-hot-toast';

const WHO={solo:'🧍 Solo friendly',family:'👨‍👩‍👧 Family safe',group:'🎒 Group vibes',couple:'💑 Couple getaway'};
const DIFF={easy:'🟢 Easy',moderate:'🟡 Moderate',challenging:'🔴 Challenging','high-altitude':'🏔️ High Altitude'};
const EXP={hills:'⛰️ Hills & Mountains',beaches:'🏖️ Beaches',forests:'🌲 Forests',desert:'🏜️ Desert',culture:'☕ Culture'};
const WA=process.env.NEXT_PUBLIC_WA_NUMBER||'919999999999';
const PHONE=process.env.NEXT_PUBLIC_PHONE||'+91 99999 99999';

export default function DetailPage(){
  const{slug}=useParams();
  const[trip,setTrip]=useState(null);
  const[loading,setLoading]=useState(true);
  const[modal,setModal]=useState(false);
  const[nf,setNf]=useState(false);
  const[reviews,setReviews]=useState([]);
  const[avgRating,setAvgRating]=useState(0);
  const[reviewForm,setReviewForm]=useState({rating:5,comment:''});
  const[submittingReview,setSubmittingReview]=useState(false);
  const{user}=useAuth();

  useEffect(()=>{
    getTripBySlug(slug).then(r=>{
      setTrip(r.data);
      return getReviews(r.data._id);
    }).then(r=>{
      setReviews(r.data.reviews||[]);
      setAvgRating(r.data.averageRating||0);
    }).catch(()=>setNf(true)).finally(()=>setLoading(false));
  },[slug]);

  const waMsg=trip?encodeURIComponent(`Hi unmapped! Interested in: ${trip.title}\nLocation: ${trip.location}\nDuration: ${trip.duration}\nPrice: Rs${trip.price?.toLocaleString()}\nPlease share details!`):'';

  const handleReview=async(e)=>{
    e.preventDefault();
    if(!user){toast.error('Please login to leave a review.');return;}
    setSubmittingReview(true);
    try{
      const r=await addReview({trip:trip._id,...reviewForm});
      setReviews(prev=>[r.data,...prev]);
      setReviewForm({rating:5,comment:''});
      toast.success('Review added! Thank you.');
    }catch(err){toast.error(err.response?.data?.message||'Failed to submit review.');}
    finally{setSubmittingReview(false);}
  };

  if(loading)return<div className="min-h-screen bg-um-black flex items-center justify-center"><p className="text-um-beige font-mono animate-pulse">Loading...</p></div>;
  if(nf||!trip)return<main className="min-h-screen bg-um-black"><Navbar/><div className="flex flex-col items-center justify-center min-h-[70vh] gap-4"><p className="text-5xl">🗺️</p><p className="text-white/50">Not found.</p><Link href="/trips" className="text-um-accent hover:text-um-warm text-sm">Back to trips</Link></div><Footer/></main>;

  const isLow=trip.seatsAvailable<=5;
  const backUrl=trip.type==='trek'?'/trek':'/trips';
  const backLabel=trip.type==='trek'?'Trek':'Trips';

  return(
    <main className="min-h-screen bg-um-black">
      <Navbar/>
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <img src={trip.image} alt={trip.title} className="w-full h-full object-cover"/>
        <div className="absolute inset-0" style={{background:'linear-gradient(to top,rgba(10,10,10,1) 0%,rgba(10,10,10,0.3) 50%,rgba(10,10,10,0.5) 100%)'}}/>
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 pb-10">
          <div className="flex items-center gap-2 mb-4 text-xs text-white/35">
            <Link href="/" className="hover:text-um-beige transition-colors">Home</Link><span>›</span>
            <Link href={backUrl} className="hover:text-um-beige transition-colors">{backLabel}</Link><span>›</span>
            <span className="text-um-beige truncate max-w-xs">{trip.title}</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {trip.type==='trek'&&trip.difficulty&&<span className="px-3 py-1 text-xs rounded-full bg-white/10 backdrop-blur-sm text-white/70 border border-white/10">{DIFF[trip.difficulty]}</span>}
            {trip.experienceType&&<span className="px-3 py-1 text-xs rounded-full bg-white/10 backdrop-blur-sm text-white/70 border border-white/10">{EXP[trip.experienceType]}</span>}
            {avgRating>0&&<span className="px-3 py-1 text-xs rounded-full bg-um-accent/15 text-um-accent border border-um-accent/25">{'★'.repeat(Math.round(avgRating))} {avgRating} ({reviews.length})</span>}
          </div>
          <h1 className="font-display font-black text-3xl md:text-4xl text-um-white leading-tight mb-2">{trip.title}</h1>
          <p className="text-white/50 text-sm flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-um-accent inline-block"/>{trip.location}</p>
        </div>
      </section>

      <div className="sticky top-14 z-40 bg-um-black/95 backdrop-blur-xl border-b border-white/5 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-5 flex-shrink-0">
            <div className="text-center"><p className="font-display font-bold text-xl text-um-beige">Rs{trip.price?.toLocaleString()}</p><p className="text-white/30 text-xs">per person</p></div>
            <div className="w-px h-8 bg-white/10"/>
            <div className="text-center"><p className="text-um-white font-semibold text-sm">{trip.duration}</p><p className="text-white/30 text-xs">duration</p></div>
            <div className="w-px h-8 bg-white/10"/>
            <div className="text-center"><p className={`font-semibold text-sm ${isLow?'text-red-400':'text-green-400'}`}>{trip.seatsAvailable} left</p><p className="text-white/30 text-xs">seats</p></div>
          </div>
          {/* <div className="flex gap-2 flex-shrink-0">
            <a href={`https://wa.me/${WA}?text=${waMsg}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-green-500/30 text-green-300 rounded-full text-xs hover:bg-green-500/8 transition-all">💬 WhatsApp</a>
            <button onClick={()=>setModal(true)} className="px-5 py-2 bg-um-accent text-um-black font-bold rounded-full text-xs hover:bg-um-warm transition-all">Book Now</button>
          </div> */}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <div><h2 className="font-display font-bold text-lg text-um-white mb-3">Overview</h2><p className="text-white/60 leading-relaxed">{trip.description}</p></div>

          {trip.whoIsItFor?.length>0&&(
            <div><h2 className="font-display font-bold text-lg text-um-white mb-3">Who is this for?</h2>
              <div className="flex flex-wrap gap-3">{trip.whoIsItFor.map(w=><span key={w} className="px-4 py-2 rounded-xl glass border border-white/8 text-white/65 text-sm">{WHO[w]||w}</span>)}</div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trip.included?.length>0&&(
              <div><h3 className="font-display font-bold text-base text-um-white mb-3">Included</h3>
                <ul className="space-y-2.5">{trip.included.map((item,i)=><li key={i} className="flex items-start gap-3 text-sm text-white/60"><span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>{item}</li>)}</ul>
              </div>
            )}
            {trip.excluded?.length>0&&(
              <div><h3 className="font-display font-bold text-base text-um-white mb-3">Not included</h3>
                <ul className="space-y-2.5">{trip.excluded.map((item,i)=><li key={i} className="flex items-start gap-3 text-sm text-white/60"><span className="text-red-400/70 mt-0.5 flex-shrink-0">✕</span>{item}</li>)}</ul>
              </div>
            )}
          </div>

          {trip.stayType&&<div><h2 className="font-display font-bold text-2xl text-um-white mb-4">Where you stay</h2><div className="glass rounded-2xl p-5"><p className="text-um-beige font-semibold mb-2">{trip.stayType}</p><p className="text-white/55 text-sm leading-relaxed">{trip.stayDescription}</p></div></div>}
          {trip.localTransport&&<div><h2 className="font-display font-bold text-2xl text-um-white mb-4">Getting there</h2><div className="glass rounded-2xl p-5"><p className="text-white/55 text-sm leading-relaxed">{trip.localTransport}</p></div></div>}
          {trip.importantNotes&&<div><h2 className="font-display font-bold text-2xl text-um-white mb-4">Important notes</h2><div className="glass-warm rounded-2xl p-5 border border-um-beige/10"><p className="text-white/55 text-sm leading-relaxed">{trip.importantNotes}</p></div></div>}

          {/* Reviews section */}
          <div>
            <h2 className="font-display font-bold text-2xl text-um-white mb-6">Reviews {reviews.length>0&&<span className="text-um-accent text-lg">({avgRating}★)</span>}</h2>
            {user?(
              <form onSubmit={handleReview} className="glass rounded-2xl p-5 mb-6">
                <p className="text-white/50 text-sm mb-3">Leave a review</p>
                <div className="flex gap-2 mb-3">
                  {[1,2,3,4,5].map(s=><button key={s} type="button" onClick={()=>setReviewForm(f=>({...f,rating:s}))} className={`text-2xl transition-all ${reviewForm.rating>=s?'text-um-accent':'text-white/20'}`}>★</button>)}
                </div>
                <textarea className="um-input resize-none mb-3" rows={3} placeholder="Share your experience..." value={reviewForm.comment} onChange={e=>setReviewForm(f=>({...f,comment:e.target.value}))} required/>
                <button type="submit" disabled={submittingReview} className="px-6 py-2.5 bg-um-accent text-um-black font-bold rounded-full text-sm hover:bg-um-warm transition-all disabled:opacity-50">{submittingReview?'Submitting...':'Submit Review'}</button>
              </form>
            ):(
              <div className="glass rounded-2xl p-5 mb-6 text-center">
                <p className="text-white/40 text-sm">
                  <Link href="/auth" className="text-um-accent hover:text-um-warm">Login</Link> to leave a review
                </p>
              </div>
            )}
            {reviews.length===0?<p className="text-white/30 text-sm">No reviews yet. Be the first!</p>:(
              <div className="space-y-4">
                {reviews.map(r=>(
                  <div key={r._id} className="glass rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full bg-um-accent/20 flex items-center justify-center text-sm font-bold text-um-accent">{r.user?.name?.charAt(0).toUpperCase()}</div>
                      <div><p className="text-um-white font-semibold text-sm">{r.user?.name}</p><div className="flex gap-0.5">{Array(r.rating).fill(0).map((_,i)=><span key={i} className="text-um-accent text-xs">★</span>)}</div></div>
                      <span className="ml-auto text-white/25 text-xs">{new Date(r.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Booking sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-36 glass rounded-2xl p-4">
            <div className="mb-5">
              <div className="font-display font-black text-2xl text-um-beige mb-1">Rs{trip.price?.toLocaleString()}</div>
              <p className="text-white/35 text-xs mb-3">per person · {trip.duration}</p>
            </div>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl mb-5 text-xs ${isLow?'bg-red-500/10 border border-red-500/20 text-red-300':'bg-green-500/10 border border-green-500/20 text-green-300'}`}>
              <span>{isLow?'🔥':'✅'}</span>{isLow?`Only ${trip.seatsAvailable} seats left!`:`${trip.seatsAvailable} seats available`}
            </div>
            <button onClick={()=>setModal(true)} className="w-full py-2.5 bg-um-accent text-um-black font-bold rounded-xl hover:bg-um-warm transition-all text-sm mb-2">Send Inquiry →</button>
            <a href={`https://wa.me/${WA}?text=${waMsg}`} target="_blank" rel="noopener noreferrer" className="w-full py-2 border border-green-500/25 text-green-300 rounded-xl hover:bg-green-500/8 transition-all text-xs flex items-center justify-center gap-2 mb-2">💬 WhatsApp Us</a>
            <a href={`tel:${PHONE}`} className="w-full py-2 border border-white/10 text-white/50 rounded-xl hover:bg-white/4 transition-all text-xs flex items-center justify-center gap-2 mb-3">📞 {PHONE}</a>
            <div className="space-y-2 border-t border-white/5 pt-4">
              {['No advance payment','24hr team response','Confirmation email sent'].map(b=><p key={b} className="text-white/30 text-xs flex items-center gap-2"><span className="text-green-400/60">✓</span>{b}</p>)}
            </div>
          </div>
        </div>
      </div>
      <Footer/>
      {modal&&<BookingModal trip={trip} onClose={()=>setModal(false)}/>}
    </main>
  );
}
