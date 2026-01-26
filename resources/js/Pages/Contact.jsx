import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Contact({ auth, hospitals }) { // ✅ Accepts 'hospitals' from DB
    
    // Search state for the hospital list
    const [search, setSearch] = useState('');

    // Filter hospitals based on search
    const filteredHospitals = hospitals.filter(h => 
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.address.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <Head title="Contact Us" />

            {/* MAIN WRAPPER: Dark Theme */}
            <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-teal-500 selection:text-white">
                
                {/* --- NAVIGATION BAR --- */}
                <nav className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-20 items-center">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center transform rotate-3">
                                    <span className="text-white font-bold text-xl">+</span>
                                </div>
                                <span className="text-2xl font-bold tracking-tight text-white">
                                    Medi<span className="text-teal-400">Flow</span>
                                </span>
                            </Link>

                            <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-300">
                                <Link href="/" className="hover:text-teal-400 transition">Home</Link>
                                <Link href={route('dashboard')} className="hover:text-teal-400 transition">Doctors</Link>
                                <span className="text-teal-400 font-bold border-b-2 border-teal-400 pb-1">Contact</span>
                            </div>

                            <div className="flex items-center space-x-4">
                                {auth?.user ? (
                                    <Link href={route('dashboard')} className="text-slate-300 hover:text-white font-medium">Dashboard</Link>
                                ) : (
                                    <Link href={route('login')} className="text-slate-300 hover:text-white font-medium">Log in</Link>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* --- HEADER --- */}
                <div className="pt-32 pb-12 text-center px-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">National Hospital Network</h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Access contact details for all {hospitals.length} government hospitals across Sri Lanka.
                    </p>
                </div>

                {/* --- CONTENT GRID --- */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        
                        {/* LEFT: MAP & DIRECTORY */}
                        <div className="space-y-8">
                            
                            {/* Embedded Map: Searches for "Government Hospitals Sri Lanka" */}
                            <div className="bg-white/5 p-2 rounded-3xl border border-white/10 shadow-2xl h-[400px] relative overflow-hidden group">
                                <iframe 
                                    className="w-full h-full rounded-2xl relative z-10 grayscale hover:grayscale-0 transition duration-700"
                                    src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d1980356.5478263125!2d79.8606872!3d7.8730542!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sGovernment%20Hospitals%20Sri%20Lanka!5e0!3m2!1sen!2slk!4v1700000000000!5m2!1sen!2slk"
                                    allowFullScreen="" 
                                    loading="lazy" 
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>

                            {/* Hospital List (Scrollable) */}
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 h-[600px] flex flex-col">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <span>🏥</span> Hospital Directory
                                    </h3>
                                    <span className="text-xs bg-teal-500/20 text-teal-400 px-2 py-1 rounded-full">{filteredHospitals.length} Locations</span>
                                </div>
                                
                                {/* Search Box */}
                                <div className="mb-4">
                                    <input 
                                        type="text" 
                                        placeholder="Search by city or name..." 
                                        className="w-full bg-slate-950/50 border border-white/10 text-white rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>

                                {/* Scrollable List */}
                                <div className="overflow-y-auto pr-2 custom-scrollbar space-y-3 flex-1">
                                    {filteredHospitals.map((h, i) => (
                                        <div key={i} className="flex justify-between items-start border-b border-white/5 pb-3 last:border-0 last:pb-0 hover:bg-white/5 p-3 rounded-lg transition">
                                            <div>
                                                <p className="font-semibold text-white text-sm">{h.name}</p>
                                                <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                                                    <span>📍</span> {h.address}
                                                </div>
                                            </div>
                                            <a href={`tel:${h.contact_number}`} className="text-teal-400 font-mono text-xs hover:text-white transition bg-teal-500/10 px-2 py-1 rounded border border-teal-500/20 whitespace-nowrap">
                                                📞 {h.contact_number}
                                            </a>
                                        </div>
                                    ))}
                                    {filteredHospitals.length === 0 && (
                                        <p className="text-center text-slate-500 text-sm mt-10">No hospitals found matching "{search}"</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: INQUIRY FORM (Fixed Position) */}
                        <div>
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl sticky top-28">
                                <h3 className="text-2xl font-bold text-white mb-2">General Inquiry</h3>
                                <p className="text-slate-400 mb-8">Can't find what you're looking for? Send a message to the Ministry of Health help desk.</p>

                                <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert("Message sent! We will contact you shortly."); }}>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Your Name</label>
                                        <input type="text" placeholder="John Doe" className="w-full bg-slate-950/50 border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none transition" required />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                                        <input type="email" placeholder="john@example.com" className="w-full bg-slate-950/50 border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none transition" required />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                                        <select className="w-full bg-slate-950/50 border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none transition">
                                            <option>General Information</option>
                                            <option>Complaint</option>
                                            <option>Emergency Service</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                                        <textarea rows="4" placeholder="Type your message here..." className="w-full bg-slate-950/50 border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none transition" required></textarea>
                                    </div>

                                    <button className="w-full py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-teal-500/20 active:scale-95 transition">
                                        Send Inquiry
                                    </button>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>

                {/* --- FOOTER --- */}
                <footer className="bg-slate-950 py-12 border-t border-white/10 text-center">
                    <p className="text-slate-500 text-sm">© 2026 MediFlow Inc. Designed for Sri Lanka 🇱🇰</p>
                </footer>

            </div>
        </>
    );
}