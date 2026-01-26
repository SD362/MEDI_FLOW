import { Link, Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function PatientDashboard({ auth, schedules, filters }) {

    // --- SEARCH LOGIC ---
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');

    const handleTyping = (e) => {
        setSearchTerm(e.target.value);
    };

    const triggerSearch = () => {
        router.get(route('dashboard'), { search: searchTerm }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            triggerSearch();
        }
    };

    // --- BOOKING LOGIC ---
    const handleBook = (scheduleId) => {
        const date = prompt("Enter appointment date (YYYY-MM-DD):", "2026-02-01");
        
        if (date) {
            router.post(route('appointments.store'), {
                schedule_id: scheduleId,
                date: date
            }, {
                onSuccess: () => alert('Appointment Booked Successfully!'),
                onError: (errors) => {
                    alert('Error: ' + (errors.date || errors.schedule_id || 'Could not book.'));
                }
            });
        }
    };

    // --- LOGOUT LOGIC ---
    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    return (
        <>
            <Head title="Find a Doctor" />

            {/* ✅ MAIN WRAPPER: Deep Navy Background (Matches Home Page) */}
            <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-teal-500 selection:text-white">
                
                {/* --- NAVIGATION BAR (Custom for Dashboard) --- */}
                <nav className="fixed w-full z-50 transition-all duration-300 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-20 items-center">
                            
                            {/* Logo */}
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center transform rotate-3">
                                    <span className="text-white font-bold text-xl">+</span>
                                </div>
                                <span className="text-2xl font-bold tracking-tight text-white">
                                    Medi<span className="text-teal-400">Flow</span>
                                </span>
                            </Link>

                            {/* Center Links (Home Page Style - No "Doctors" Tab) */}
                            <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-300">
                                <Link href="/" className="hover:text-teal-400 transition">Home</Link>
                                <a href="/#services" className="hover:text-teal-400 transition">Services</a>
                                <a href="/#about" className="hover:text-teal-400 transition">About</a>
                                <a href="/#contact" className="hover:text-teal-400 transition">Contact</a>
                            </div>

                            {/* Right Actions: User Profile & Logout */}
                            <div className="flex items-center gap-4">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm text-slate-400">Welcome,</p>
                                    <p className="text-sm font-bold text-white">{auth.user.name}</p>
                                </div>

                                <form onSubmit={handleLogout}>
                                    <button 
                                        type="submit"
                                        className="px-5 py-2 bg-slate-800 border border-white/10 text-white rounded-full text-sm font-bold hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 transition"
                                    >
                                        Log Out
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* --- CONTENT SECTION --- */}
                <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    
                    {/* Header & Search */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
                            Find Your <span className="text-teal-400">Specialist</span>
                        </h1>
                        <p className="text-slate-400 mb-10 text-lg max-w-2xl mx-auto">
                            Browse our roster of top-tier medical professionals and book your consultation instantly.
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-2xl mx-auto group">
                            <div className="absolute inset-0 bg-teal-500/20 rounded-full blur-xl group-hover:bg-teal-500/30 transition duration-500"></div>
                            <input 
                                type="text" 
                                placeholder="Search by Doctor Name or Specialization..." 
                                className="relative w-full bg-white/5 border border-white/10 text-white rounded-full py-4 pl-14 pr-4 focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:bg-white/10 transition backdrop-blur-md shadow-2xl placeholder-slate-500 text-lg"
                                value={searchTerm}
                                onChange={handleTyping}
                                onKeyDown={handleKeyDown}
                            />
                            <button 
                                onClick={triggerSearch}
                                className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-teal-400 transition z-10"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Doctor Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {schedules.map(schedule => (
                            <div key={schedule.id} className="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-teal-500/50 transition duration-300 group shadow-lg flex flex-col">
                                
                                {/* Image */}
                                <div className="flex justify-center mb-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-teal-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition duration-500"></div>
                                        {schedule.doctor.image ? (
                                            <img 
                                                src={`/storage/${schedule.doctor.image}`} 
                                                alt="Doctor" 
                                                className="relative h-28 w-28 rounded-full object-cover border-4 border-slate-800 shadow-xl group-hover:scale-105 transition duration-300"
                                            />
                                        ) : (
                                            <div className="relative h-28 w-28 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 font-bold text-2xl border-4 border-slate-700">
                                                DR
                                            </div>
                                        )}
                                        <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-slate-900 rounded-full z-10"></div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="text-center flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-white mb-2">{schedule.doctor.user.name}</h3>
                                    <div className="mb-6">
                                        <span className="inline-block px-3 py-1 bg-teal-500/10 text-teal-400 rounded-full text-xs font-bold uppercase tracking-wide border border-teal-500/20">
                                            {schedule.doctor.specialization}
                                        </span>
                                    </div>
                                    
                                    <div className="bg-slate-950/50 rounded-xl p-4 mb-6 border border-white/5 text-sm text-slate-300 text-left space-y-3 shadow-inner">
                                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                            <span className="text-slate-500 text-xs uppercase font-bold">Hospital</span> 
                                            <span className="font-semibold text-white">{schedule.hospital.name}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                            <span className="text-slate-500 text-xs uppercase font-bold">Day</span> 
                                            <span className="font-semibold text-white">{schedule.day}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500 text-xs uppercase font-bold">Time</span> 
                                            <span className="font-bold text-teal-400 bg-teal-400/10 px-2 py-0.5 rounded">{schedule.start_time} - {schedule.end_time}</span>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => handleBook(schedule.id)}
                                        className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-bold hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 mt-auto"
                                    >
                                        Book Appointment
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Empty State */}
                        {schedules.length === 0 && (
                            <div className="col-span-1 md:col-span-3 text-center py-20 bg-white/5 rounded-3xl border border-white/5 border-dashed">
                                <div className="text-6xl mb-4 opacity-50">🔍</div>
                                <h3 className="text-2xl font-bold text-white">No Doctors Found</h3>
                                <p className="text-slate-400 mt-2 max-w-md mx-auto">
                                    We couldn't find any doctors matching "{searchTerm}".
                                </p>
                                {searchTerm && (
                                    <button 
                                        onClick={() => { setSearchTerm(''); router.get(route('dashboard')); }}
                                        className="mt-6 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition border border-white/10"
                                    >
                                        Clear Search
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}