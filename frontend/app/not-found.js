import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-um-black flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="relative mb-8 inline-block">
          <div className="font-display font-black text-um-beige/10 leading-none select-none" style={{fontSize:'10rem'}}>404</div>
          <div className="absolute inset-0 flex items-center justify-center"><span className="text-6xl">🗺️</span></div>
        </div>
        <h1 className="font-display font-black text-3xl text-um-white mb-3">You went off the map.</h1>
        <p className="text-white/45 leading-relaxed mb-8">This page does not exist — but some of the best adventures start by taking a wrong turn.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="px-6 py-3 bg-um-accent text-um-black font-bold rounded-full hover:bg-um-warm transition-all text-sm">Back to Home</Link>
          <Link href="/trips" className="px-6 py-3 border border-white/10 text-white/60 rounded-full hover:border-um-beige hover:text-um-beige transition-all text-sm">Browse Trips</Link>
        </div>
      </div>
    </div>
  );
}
