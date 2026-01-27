import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

/**
 * Specialists Component
 * Orchestrates the public practitioner directory.
 * Implements dual-factor filtering (Categorical & Lexical) to streamline doctor discovery.
 */
export default function Specialists({ auth, doctors, specialties }) {

    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);

    /**
     * Logic: Synchronous Data Filtering
     * Segregates the doctor dataset based on active specialization filters
     * and real-time search string matching.
     */
    const filteredDoctors = doctors.filter(doc => {
        const matchesCategory = selectedCategory ? doc.specialization === selectedCategory : true;
        const matchesSearch = doc.user.name.toLowerCase().includes(search.toLowerCase()) ||
                              doc.specialization.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <>
            <Head title="Medical Specialists | MediFlow" />

            <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-teal-500/30">

                {/* --- NAVIGATION INTERFACE --- */}
                <nav className="fixed z-50 w-full border-b border-white/5 bg-slate-900/60 backdrop-blur-xl">
                    <div className="px-6 mx-auto max-w-7xl lg:px-8">
                        <div className="flex items-center justify-between h-20">
                            <Link href="/" className="flex items-center gap-3 group">
                                <div className="flex items-center justify-center w-10 h-10 transition-transform bg-teal-500 shadow-lg rounded-xl group-hover:rotate-6 shadow-teal-500/20">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                    </svg>
                                </div>
                                <span className="text-xl font-bold tracking-tighter text-white">
                                    MediFlow <span className="ml-1 text-sm font-black tracking-widest text-teal-500 uppercase">Specialists</span>
                                </span>
                            </Link>

                            <div className="hidden p-1 space-x-1 border md:flex bg-black/20 rounded-2xl border-white/5">
                                <Link href="/" className="px-6 py-2 text-xs font-bold tracking-widest uppercase transition rounded-xl text-slate-400 hover:text-white">Home</Link>
                                <span className="px-6 py-2 text-xs font-bold tracking-widest uppercase bg-teal-500 shadow-lg rounded-xl text-slate-900">Doctors</span>
                                <a href="/#services" className="px-6 py-2 text-xs font-bold tracking-widest uppercase transition rounded-xl text-slate-400 hover:text-white">Services</a>
                                <Link href={route('contact')} className="px-6 py-2 text-xs font-bold tracking-widest uppercase transition rounded-xl text-slate-400 hover:text-white">Contact</Link>
                            </div>

                            <div className="flex items-center">
                                {auth?.user ? (
                                    <Link href={route('dashboard')} className="px-5 py-2 text-xs font-bold tracking-widest uppercase transition border rounded-full border-white/10 hover:bg-white/5">Dashboard</Link>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <Link href={route('login')} className="text-xs font-bold tracking-widest uppercase transition text-slate-400 hover:text-white">Log in</Link>
                                        <Link href={route('register')} className="px-6 py-2.5 bg-teal-500 text-slate-900 rounded-full font-black text-xs uppercase tracking-widest hover:bg-teal-400 transition shadow-xl shadow-teal-500/10">Sign Up</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* --- PAGE HEADER --- */}
                <div className="px-6 pt-40 pb-16 text-center">
                    <h1 className="mb-6 text-4xl italic font-black tracking-tighter text-white md:text-6xl">Expert Medical Practitioners</h1>
                    <p className="text-slate-500 max-w-2xl mx-auto text-sm font-bold uppercase tracking-[0.2em] leading-relaxed">
                        Access a global network of {doctors.length} verified specialists dedicated to clinical excellence.
                    </p>
                </div>

                {/* --- OPERATIONAL CONTENT --- */}
                <div className="px-6 pb-32 mx-auto max-w-7xl lg:px-8">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">

                        {/* LEFT MODULE: CONTROL PANEL */}
                        <div className="space-y-8 lg:col-span-1">
                            <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 backdrop-blur-md shadow-2xl">
                                <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-6 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                                    Search Registry
                                </h3>
                                <input
                                    type="text"
                                    placeholder="Name or discipline..."
                                    className="w-full h-12 px-5 text-sm text-white transition-all border outline-none bg-black/20 border-white/10 rounded-xl focus:ring-2 focus:ring-teal-500 placeholder:text-slate-700"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 backdrop-blur-md shadow-2xl">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] flex items-center gap-2">
                                        <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.503 1.508a10.003 10.003 0 01-6.417-6.417l1.508-.503a2 2 0 001.414-1.96l-.477-2.387a2 2 0 00-.547-1.022L7.877 3.712a2 2 0 00-2.828 0L3.712 5.05a2 2 0 00-.547 1.022 10.003 10.003 0 0012.354 12.354 2 2 0 001.022-.547l1.338-1.338a2 2 0 000-2.828l-1.338-1.338z"/></svg>
                                        Specialties
                                    </h3>
                                    {selectedCategory && (
                                        <button onClick={() => setSelectedCategory(null)} className="text-[9px] font-black uppercase text-red-500 hover:text-white transition tracking-widest">Clear</button>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {specialties.map((cat, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                                            className={`w-full text-left px-5 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-teal-500 text-slate-900 shadow-lg' : 'bg-white/5 text-slate-500 hover:bg-white/10 hover:text-white'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT MODULE: DIRECTORY GRID */}
                        <div className="lg:col-span-3">
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {filteredDoctors.map(doctor => (
                                    <div key={doctor.id} className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 hover:bg-white/[0.05] hover:border-teal-500/20 transition-all duration-500 group shadow-2xl flex flex-col items-center text-center">
                                        <div className="relative mb-6">
                                            {doctor.image ? (
                                                <img src={`/storage/${doctor.image}`} alt="Specialist" className="h-28 w-28 rounded-[2rem] object-cover border-2 border-white/10 shadow-2xl group-hover:scale-105 transition duration-500" />
                                            ) : (
                                                <div className="h-28 w-28 rounded-[2.5rem] bg-slate-800 border-2 border-white/5 flex items-center justify-center text-slate-500 font-black text-2xl italic">DR</div>
                                            )}
                                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-teal-500 rounded-xl flex items-center justify-center border-4 border-[#0f172a] shadow-lg shadow-teal-500/20">
                                                <svg className="w-4 h-4 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                                            </div>
                                        </div>

                                        <h3 className="mb-1 text-xl italic font-black tracking-tight text-white">Dr. {doctor.user.name}</h3>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-500 mb-6">{doctor.specialization}</span>

                                        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-10 line-clamp-3 min-h-[50px]">
                                            {doctor.bio || "High-performing specialist integrated within the MediFlow health infrastructure."}
                                        </p>

                                        <Link
                                            href={route('dashboard', { doctor_id: doctor.id })}
                                            className="w-full h-14 bg-white/[0.03] hover:bg-teal-500 border border-white/5 hover:border-teal-400 text-white hover:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl"
                                        >
                                            Initiate Booking
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                                        </Link>
                                    </div>
                                ))}
                            </div>

                            {filteredDoctors.length === 0 && (
                                <div className="text-center py-40 border-2 border-dashed border-white/5 rounded-[3rem]">
                                    <p className="text-slate-600 font-black uppercase tracking-[0.3em] text-xs italic">No Practitioners Match Your Query</p>
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                <footer className="py-16 text-center border-t bg-slate-950/50 border-white/5">
                    <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">© 2026 MediFlow Infrastructure • Licensed Clinical Network</p>
                </footer>
            </div>
        </>
    );
}
