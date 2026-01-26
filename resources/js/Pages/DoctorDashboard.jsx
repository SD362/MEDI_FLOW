import { Link, Head, useForm, router } from '@inertiajs/react';

export default function DoctorDashboard({ auth, hospitals, appointments }) {
    
    // --- 1. Form handling for "Set Availability" ---
    const { data, setData, post, processing, errors, reset } = useForm({
        hospital_id: '',
        day: 'Monday',
        start_time: '',
        end_time: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('schedules.store'), {
            onSuccess: () => reset(),
        });
    };

    // --- 2. Function to Confirm or Cancel Appointments ---
    const updateStatus = (id, newStatus) => {
        if (confirm(`Are you sure you want to ${newStatus} this appointment?`)) {
            router.patch(route('appointments.status', id), {
                status: newStatus
            });
        }
    };

    // --- 3. LOGOUT LOGIC ---
    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    return (
        <>
            <Head title="Doctor Dashboard" />

            {/* ✅ MAIN WRAPPER: Deep Navy Background */}
            <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-teal-500 selection:text-white">
                
                {/* --- NAVIGATION BAR --- */}
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

                            {/* Center Links (Home Page Style) */}
                            <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-300">
                                <Link href="/" className="hover:text-teal-400 transition">Home</Link>
                                <a href="/#services" className="hover:text-teal-400 transition">Services</a>
                                <a href="/#about" className="hover:text-teal-400 transition">About</a>
                                <Link href={route('contact')} className="hover:text-teal-400 transition">Contact</Link>
                            </div>

                            {/* Right Actions: Doctor Profile & Logout */}
                            <div className="flex items-center gap-4">
                                
                                {/* Doctor Profile Badge */}
                                <div className="flex items-center gap-3 bg-slate-800/50 py-1.5 px-3 rounded-full border border-white/10">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                        DR
                                    </div>
                                    <div className="text-left hidden sm:block pr-2">
                                        <p className="text-[10px] uppercase tracking-wider text-teal-400 leading-none mb-0.5">Doctor</p>
                                        <p className="text-sm font-bold text-white leading-none">{auth.user.name}</p>
                                    </div>
                                </div>

                                {/* Logout Button */}
                                <form onSubmit={handleLogout}>
                                    <button 
                                        type="submit"
                                        className="px-5 py-2 bg-slate-800 border border-white/10 text-slate-300 rounded-full text-sm font-semibold hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 transition flex items-center gap-2"
                                    >
                                        <span>Log Out</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* --- CONTENT SECTION --- */}
                <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
                    
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-white/10 pb-6">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">Doctor Portal</h2>
                            <p className="text-slate-400">Manage your schedule and upcoming patient appointments.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* --- LEFT COL: SET AVAILABILITY FORM --- */}
                        <div className="lg:col-span-1">
                            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6 shadow-xl sticky top-28">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <span className="text-2xl">📅</span> Set Availability
                                </h3>
                                
                                <form onSubmit={submit} className="space-y-5">
                                    
                                    {/* Select Hospital */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Hospital</label>
                                        <select 
                                            className="w-full bg-slate-900/50 border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                                            value={data.hospital_id}
                                            onChange={(e) => setData('hospital_id', e.target.value)}
                                        >
                                            <option value="" className="bg-slate-900">-- Choose Hospital --</option>
                                            {hospitals.map(hospital => (
                                                <option key={hospital.id} value={hospital.id} className="bg-slate-900">
                                                    {hospital.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.hospital_id && <div className="text-red-400 text-sm mt-1">{errors.hospital_id}</div>}
                                    </div>

                                    {/* Select Day */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Day of Week</label>
                                        <select 
                                            className="w-full bg-slate-900/50 border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                                            value={data.day}
                                            onChange={(e) => setData('day', e.target.value)}
                                        >
                                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                                <option key={day} value={day} className="bg-slate-900">{day}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Time Slots */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">Start Time</label>
                                            <input 
                                                type="time" 
                                                className="w-full bg-slate-900/50 border border-white/10 text-white rounded-xl px-3 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                                                value={data.start_time}
                                                onChange={(e) => setData('start_time', e.target.value)}
                                            />
                                            {errors.start_time && <div className="text-red-400 text-sm mt-1">{errors.start_time}</div>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">End Time</label>
                                            <input 
                                                type="time" 
                                                className="w-full bg-slate-900/50 border border-white/10 text-white rounded-xl px-3 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                                                value={data.end_time}
                                                onChange={(e) => setData('end_time', e.target.value)}
                                            />
                                            {errors.end_time && <div className="text-red-400 text-sm mt-1">{errors.end_time}</div>}
                                        </div>
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-bold hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 mt-4"
                                        disabled={processing}
                                    >
                                        {processing ? 'Saving...' : 'Add Schedule'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* --- RIGHT COL: APPOINTMENTS TABLE --- */}
                        <div className="lg:col-span-2">
                            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-xl">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <span className="text-2xl">🩺</span> Upcoming Appointments
                                </h3>
                                
                                <div className="overflow-hidden rounded-xl border border-white/10">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-white/10 text-slate-300 text-sm uppercase tracking-wider">
                                                <th className="p-4 font-semibold">Patient</th>
                                                <th className="p-4 font-semibold">Date & Time</th>
                                                <th className="p-4 font-semibold">Location</th>
                                                <th className="p-4 font-semibold">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/10">
                                            {appointments && appointments.length > 0 ? (
                                                appointments.map(app => (
                                                    <tr key={app.id} className="hover:bg-white/5 transition duration-150">
                                                        <td className="p-4">
                                                            <div className="font-bold text-white">{app.user.name}</div>
                                                            <div className="text-xs text-slate-400">ID: #{app.user.id}</div>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="text-white">{app.date}</div>
                                                            <div className="text-xs text-teal-400 font-mono mt-1">
                                                                {app.schedule.start_time} - {app.schedule.end_time}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-slate-300">
                                                            {app.schedule.hospital?.name || 'N/A'}
                                                        </td>
                                                        
                                                        {/* Status Buttons */}
                                                        <td className="p-4">
                                                            {app.status === 'pending' ? (
                                                                <div className="flex gap-2">
                                                                    <button 
                                                                        onClick={() => updateStatus(app.id, 'confirmed')}
                                                                        className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500 hover:text-white transition border border-green-500/30"
                                                                        title="Confirm"
                                                                    >
                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => updateStatus(app.id, 'cancelled')}
                                                                        className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition border border-red-500/30"
                                                                        title="Cancel"
                                                                    >
                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                                                    ${app.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                                                                      app.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                                                                      'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                                                                    {app.status.toUpperCase()}
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="p-8 text-center text-slate-500">
                                                        No upcoming appointments found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}