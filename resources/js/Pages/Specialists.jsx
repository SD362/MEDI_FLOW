import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Specialists({ auth, doctors, specialties }) {
    
    // --- STATE ---
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);

    // --- FILTER LOGIC ---
    const filteredDoctors = doctors.filter(doc => {
        const matchesCategory = selectedCategory ? doc.specialization === selectedCategory : true;
        const matchesSearch = doc.user.name.toLowerCase().includes(search.toLowerCase()) || 
                              doc.specialization.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <>
            <Head title="Our Specialists" />

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
                                <span className="text-teal-400 font-bold border-b-2 border-teal-400 pb-1">Doctors</span>
                                <Link href={route('contact')} className="hover:text-teal-400 transition">Contact</Link>
                            </div>

                            <div className="flex items-center space-x-4">
                                <Link href={route('login')} className="text-slate-300 hover:text-white font-medium">Log in</Link>
                                <Link href={route('register')} className="bg-teal-500 hover:bg-teal-400 text-white px-4 py-2 rounded-full font-bold text-sm transition">
                                    Sign Up
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* --- HEADER --- */}
                <div className="pt-32 pb-12 text-center px-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Meet Our Specialists</h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Browse our directory of {doctors.length} highly qualified doctors across various specializations.
                    </p>
                </div>

                {/* --- CONTENT GRID --- */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        
                        {/* LEFT: FILTERS */}
                        <div className="lg:col-span-1 space-y-6">
                            
                            {/* Search */}
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                                <h3 className="font-bold mb-4">Search</h3>
                                <input 
                                    type="text" 
                                    placeholder="Doctor Name or Specialization..." 
                                    className="w-full bg-slate-950/50 border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none transition"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            {/* Categories */}
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold">Filter by Specialty</h3>
                                    {selectedCategory && (
                                        <button onClick={() => setSelectedCategory(null)} className="text-xs text-teal-400 hover:underline">Clear</button>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {specialties.map((cat, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                                                selectedCategory === cat 
                                                ? 'bg-teal-500 text-white font-bold' 
                                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: DOCTOR GRID */}
                        <div className="lg:col-span-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredDoctors.map(doctor => (
                                    <div key={doctor.id} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-teal-500/30 transition duration-300 group shadow-lg flex flex-col items-center text-center">
                                        
                                        {/* Image */}
                                        <div className="relative mb-4">
                                            {doctor.image ? (
                                                <img src={`/storage/${doctor.image}`} alt="Doctor" className="h-24 w-24 rounded-full object-cover border-4 border-slate-800 shadow-xl group-hover:scale-105 transition" />
                                            ) : (
                                                <div className="h-24 w-24 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 font-bold text-2xl border-4 border-slate-700">DR</div>
                                            )}
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-1">{doctor.user.name}</h3>
                                        <span className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-4">{doctor.specialization}</span>

                                        <p className="text-sm text-slate-400 mb-6 line-clamp-2 min-h-[40px]">
                                            {doctor.bio || "Highly experienced specialist dedicated to patient care."}
                                        </p>

                                        {/* Action Button */}
                                        <Link 
                                            href={route('login')}
                                            className="w-full py-2.5 bg-slate-800 hover:bg-teal-600 text-white rounded-lg font-bold transition border border-white/10 hover:border-teal-500"
                                        >
                                            Login to Book
                                        </Link>
                                    </div>
                                ))}

                                {filteredDoctors.length === 0 && (
                                    <div className="col-span-full text-center py-20">
                                        <p className="text-slate-500 text-lg">No doctors found matching your criteria.</p>
                                        <button onClick={() => {setSearch(''); setSelectedCategory(null)}} className="text-teal-400 underline mt-2">Clear Filters</button>
                                    </div>
                                )}
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