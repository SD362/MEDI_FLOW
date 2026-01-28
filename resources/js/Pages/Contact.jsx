import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

/**
 * Contact Component
 * Orchestrates the public-facing facility directory and general inquiry interface.
 * Features a dynamic mapping system synchronized with the hospital dataset.
 */
export default function Contact({ auth, hospitals }) {

    const [search, setSearch] = useState('');

    /**
     * Form State Management (Inertia)
     * Handles data binding and submission for the inquiry form.
     */
    const { data, setData, post, processing, reset } = useForm({
        full_name: '',
        email: '',
        message: ''
    });

    /**
     * State: activeMapQuery
     * Defaults to a geographic search for medical facilities in Sri Lanka.
     * Updates dynamically when a user selects a specific facility from the registry.
     */
    const [activeMapQuery, setActiveMapQuery] = useState('Government+Hospitals+Sri+Lanka');

    /**
     * Logic: Synchronous filtering of the facility dataset.
     * Searches against naming conventions and physical location strings.
     */
    const filteredHospitals = hospitals.filter(h =>
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.address.toLowerCase().includes(search.toLowerCase())
    );

    /**
     * Action: Focus Map
     * logic: Updates the map view to pinpoint a specific hospital location.
     */
    const handleFocusMap = (hospitalName) => {
        const query = encodeURIComponent(hospitalName + " Sri Lanka");
        setActiveMapQuery(query);
    };

    /**
     * Action: Submit Inquiry
     * Sends the form data to the backend via POST request.
     */
    const submitInquiry = (e) => {
        e.preventDefault();
        post(route('contact.store'), {
            onSuccess: () => {
                reset();
            },
            preserveScroll: true
        });
    };

    return (
        <>
            <Head title="Clinical Network | MediFlow" />

            <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-teal-500/30">

                {/* --- NAVIGATION INTERFACE --- */}
                <nav className="fixed z-50 w-full border-b border-white/5 bg-slate-900/60 backdrop-blur-xl">
                    <div className="px-6 mx-auto max-w-7xl lg:px-8">
                        <div className="flex items-center justify-between h-20">
                            <Link href="/" className="flex items-center gap-3 group">
                                <div className="flex items-center justify-center w-10 h-10 transition-transform bg-teal-500 rounded-xl group-hover:rotate-6">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                                </div>
                                <span className="text-xl font-bold tracking-tighter text-white">
                                    MediFlow <span className="ml-1 text-sm font-black tracking-widest text-teal-500 uppercase">Direct</span>
                                </span>
                            </Link>

                            <div className="hidden p-1 space-x-1 border md:flex bg-black/20 rounded-2xl border-white/5">
                                <Link href="/" className="px-6 py-2 text-xs font-bold tracking-widest uppercase transition rounded-xl text-slate-400 hover:text-white">Home</Link>
                                <Link href={route('specialists')} className="px-6 py-2 text-xs font-bold tracking-widest uppercase transition rounded-xl text-slate-400 hover:text-white">Doctors</Link>
                                <a href="/#services" className="px-6 py-2 text-xs font-bold tracking-widest uppercase transition rounded-xl text-slate-400 hover:text-white">Services</a>
                                <span className="px-6 py-2 text-xs font-bold tracking-widest uppercase bg-teal-500 shadow-lg rounded-xl text-slate-900">Contact</span>
                            </div>

                            <div className="flex items-center">
                                {auth?.user ? (
                                    <Link href={route('dashboard')} className="px-5 py-2 text-xs font-bold tracking-widest uppercase transition border rounded-full border-white/10 hover:bg-white/5">Dashboard</Link>
                                ) : (
                                    <Link href={route('login')} className="px-5 py-2 text-xs font-bold tracking-widest uppercase transition bg-white rounded-full text-slate-900 hover:bg-slate-200">Portal Login</Link>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* --- PAGE HEADER --- */}
                <div className="px-6 pt-40 pb-16 text-center">
                    <h1 className="mb-6 text-4xl italic font-black tracking-tighter text-white md:text-6xl">National Clinical Network</h1>
                    <p className="text-slate-500 max-w-2xl mx-auto text-sm font-bold uppercase tracking-[0.2em] leading-relaxed">
                        Access Logistics and Communication for {hospitals.length} Validated Government Facilities.
                    </p>
                </div>

                {/* --- OPERATIONAL GRID --- */}
                <div className="px-6 pb-32 mx-auto max-w-7xl lg:px-8">
                    <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">

                        {/* LEFT MODULE: FACILITY LOGISTICS */}
                        <div className="space-y-10">
                            {/* DYNAMIC MAP ENGINE */}
                            <div className="bg-white/[0.02] p-2 rounded-[2.5rem] border border-white/5 shadow-2xl h-[450px] relative overflow-hidden group">
                                {/* ✅ FIXED: Updated to standard Google Maps Embed URL structure */}
                                <iframe
                                    key={activeMapQuery}
                                    className="w-full h-full rounded-[2rem] relative z-10 grayscale-[0.8] hover:grayscale-0 transition-all duration-1000"
                                    src={`https://maps.google.com/maps?q=${activeMapQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent z-20 pointer-events-none opacity-40"></div>
                            </div>

                            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 h-[650px] flex flex-col backdrop-blur-md">
                                <div className="flex items-end justify-between mb-8">
                                    <div>
                                        <h3 className="text-xl italic font-black tracking-tight text-white">Facility Directory</h3>
                                        <p className="text-[10px] text-teal-500 font-black uppercase tracking-widest mt-1">Verified Locations</p>
                                    </div>
                                    <button
                                        onClick={() => setActiveMapQuery('Government+Hospitals+Sri+Lanka')}
                                        className="text-[10px] font-black uppercase text-teal-400 hover:text-white transition"
                                    >
                                        Global View
                                    </button>
                                </div>

                                <div className="relative mb-8">
                                    <input
                                        type="text"
                                        placeholder="Search by facility or city..."
                                        className="w-full px-6 text-sm font-medium text-white transition-all border outline-none h-14 bg-black/20 border-white/10 rounded-2xl focus:ring-2 focus:ring-teal-500"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <svg className="absolute w-6 h-6 right-5 top-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                                </div>

                                <div className="flex-1 pr-4 space-y-4 overflow-y-auto custom-scrollbar">
                                    {filteredHospitals.map((h, i) => (
                                        <div
                                            key={i}
                                            onClick={() => handleFocusMap(h.name)}
                                            className="flex justify-between items-center p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all group cursor-pointer"
                                        >
                                            <div className="max-w-[65%]">
                                                <p className="text-sm font-bold tracking-tight text-white transition-colors group-hover:text-teal-400">{h.name}</p>
                                                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-2">
                                                    <svg className="w-3.5 h-3.5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                                    {h.address}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Contact No</p>
                                                {/* Logic: Displays the contact number directly as a functional text link */}
                                                <a
                                                    href={`tel:${h.contact_number || '1990'}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="text-xs font-mono font-bold text-teal-400 hover:text-white transition-colors bg-teal-500/5 px-3 py-1.5 rounded-lg border border-teal-500/10"
                                                >
                                                    {h.contact_number || 'Emergency 1990'}
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT MODULE: SYSTEM INQUIRY */}
                        <div className="relative">
                            <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-12 shadow-2xl sticky top-32 backdrop-blur-xl">
                                <div className="mb-10">
                                    <h3 className="text-3xl italic font-black tracking-tight text-white">System Inquiry</h3>
                                    <p className="mt-2 text-xs font-bold leading-relaxed tracking-widest uppercase text-slate-500">Ministry of Health Support Hub</p>
                                </div>

                                <form className="space-y-6" onSubmit={submitInquiry}>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Full Name</label>
                                            <input
                                                type="text"
                                                className="w-full px-6 text-sm text-white transition-all border outline-none h-14 bg-black/30 border-white/10 rounded-2xl focus:ring-2 focus:ring-teal-500"
                                                value={data.full_name}
                                                onChange={e => setData('full_name', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Email Address</label>
                                            <input
                                                type="email"
                                                className="w-full px-6 text-sm text-white transition-all border outline-none h-14 bg-black/30 border-white/10 rounded-2xl focus:ring-2 focus:ring-teal-500"
                                                value={data.email}
                                                onChange={e => setData('email', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Transmission Message</label>
                                        <textarea
                                            rows="5"
                                            placeholder="Specify your requirements..."
                                            className="w-full bg-black/30 border border-white/10 text-white rounded-[2rem] p-6 text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all resize-none"
                                            value={data.message}
                                            onChange={e => setData('message', e.target.value)}
                                            required
                                        ></textarea>
                                    </div>

                                    <button
                                        disabled={processing}
                                        className="w-full h-16 bg-teal-500 text-slate-900 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-teal-500/10 hover:bg-teal-400 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Dispatching...' : 'Dispatch Inquiry'}
                                    </button>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>

                <footer className="py-16 text-center border-t bg-slate-950/50 border-white/5">
                    <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">© 2026 MediFlow Infrastructure • Health Information Systems</p>
                </footer>
            </div>
        </>
    );
}
