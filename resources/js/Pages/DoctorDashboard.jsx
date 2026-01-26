import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

// ✅ Accepts 'mySchedules' from backend to list created slots
export default function DoctorDashboard({ auth, appointments, hospitals, mySchedules }) {

    // --- STATE ---
    const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'history', or 'schedules'
    const [isWorkFormOpen, setIsWorkFormOpen] = useState(false);

    // --- FORM STATE ---
    const [scheduleData, setScheduleData] = useState({
        hospital_id: hospitals.length > 0 ? hospitals[0].id : '',
        day: 'Monday',
        start_time: '',
        end_time: '',
    });

    // --- FILTERING LOGIC ---
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingAppointments = appointments.filter(app => {
        const appDate = new Date(app.date);
        return (app.status === 'pending' || app.status === 'confirmed') && appDate >= today;
    });

    const appointmentHistory = appointments.filter(app => {
        const appDate = new Date(app.date);
        return app.status === 'completed' || app.status === 'cancelled' || appDate < today;
    });

    // --- HANDLERS ---
    const handleStatus = (id, newStatus) => {
        if (confirm(`Mark this appointment as ${newStatus}?`)) {
            router.patch(route('appointments.status', id), { status: newStatus });
        }
    };

    const submitSchedule = (e) => {
        e.preventDefault();
        router.post(route('schedules.store'), scheduleData, {
            onSuccess: () => {
                setIsWorkFormOpen(false);
                setActiveTab('schedules'); // Auto-switch to the new tab to see your slot
                alert("Availability Added Successfully!");
            }
        });
    };

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    return (
        <>
            <Head title="Doctor Dashboard" />

            <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-teal-500 selection:text-white">
                
                {/* --- NAV BAR --- */}
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

                            {/* ✅ ADDED: Navigation Tabs for Doctor */}
                            <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-300">
                                <Link href="/" className="hover:text-teal-400 transition">Home</Link>
                                <a href="/#services" className="hover:text-teal-400 transition">Services</a>
                                <Link href={route('contact')} className="hover:text-teal-400 transition">Contact</Link>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="hidden sm:flex items-center gap-2 bg-slate-800/50 py-1 px-3 rounded-full border border-white/10">
                                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                                    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Dr. {auth.user.name}</span>
                                </div>
                                <form onSubmit={handleLogout}>
                                    <button className="px-5 py-2 bg-red-500/10 border border-red-500/50 text-red-400 rounded-full text-sm font-bold hover:bg-red-500 hover:text-white transition">Log Out</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    
                    {/* 1. STATS CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg">
                            <h3 className="text-slate-400 text-xs uppercase font-bold tracking-wider">Pending Requests</h3>
                            <p className="text-4xl font-extrabold text-yellow-400 mt-2">{appointments.filter(a => a.status === 'pending').length}</p>
                        </div>
                        <div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg">
                            <h3 className="text-slate-400 text-xs uppercase font-bold tracking-wider">Upcoming Confirmed</h3>
                            <p className="text-4xl font-extrabold text-white mt-2">{upcomingAppointments.filter(a => a.status === 'confirmed').length}</p>
                        </div>
                        <div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg">
                            <h3 className="text-slate-400 text-xs uppercase font-bold tracking-wider">Total Patients Seen</h3>
                            <p className="text-4xl font-extrabold text-teal-400 mt-2">{appointments.filter(a => a.status === 'completed').length}</p>
                        </div>
                    </div>

                    {/* 2. ACTIONS BAR & TABS */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        
                        {/* Tabs */}
                        <div className="flex space-x-1 bg-white/5 p-1 rounded-xl border border-white/10">
                            <button onClick={() => setActiveTab('upcoming')} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'upcoming' ? 'bg-teal-500 text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}>Appointments</button>
                            <button onClick={() => setActiveTab('history')} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'history' ? 'bg-teal-500 text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}>History</button>
                            {/* ✅ ADDED: My Schedules Tab Button */}
                            <button onClick={() => setActiveTab('schedules')} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'schedules' ? 'bg-teal-500 text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}>My Schedules</button>
                        </div>

                        <button onClick={() => setIsWorkFormOpen(!isWorkFormOpen)} className="bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold px-5 py-2.5 rounded-xl transition flex items-center gap-2">
                            <span>🕒</span> {isWorkFormOpen ? 'Close Schedule Form' : 'Set Availability'}
                        </button>
                    </div>

                    {/* 3. SCHEDULE FORM */}
                    {isWorkFormOpen && (
                        <div className="mb-10 p-8 bg-slate-800 rounded-3xl border border-white/10 animate-in slide-in-from-top-4">
                            <h3 className="text-lg font-bold text-white mb-6">Add New Availability Slot</h3>
                            <form onSubmit={submitSchedule} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                
                                {/* ✅ FIXED: Shows ONLY Name (No Address) */}
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Select Hospital</label>
                                    <select 
                                        className="w-full bg-slate-900 border-white/10 rounded-lg text-white p-3"
                                        value={scheduleData.hospital_id}
                                        onChange={(e) => setScheduleData({...scheduleData, hospital_id: e.target.value})}
                                    >
                                        {hospitals.map(h => (
                                            <option key={h.id} value={h.id}>{h.name}</option> 
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Day of Week</label>
                                    <select className="w-full bg-slate-900 border-white/10 rounded-lg text-white p-3" value={scheduleData.day} onChange={(e) => setScheduleData({...scheduleData, day: e.target.value})}>
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Time Slot</label>
                                    <div className="flex gap-2">
                                        <input type="time" className="bg-slate-900 border-white/10 rounded-lg text-white p-3 w-full" onChange={(e) => setScheduleData({...scheduleData, start_time: e.target.value})} required />
                                        <span className="self-center text-slate-500">to</span>
                                        <input type="time" className="bg-slate-900 border-white/10 rounded-lg text-white p-3 w-full" onChange={(e) => setScheduleData({...scheduleData, end_time: e.target.value})} required />
                                    </div>
                                </div>
                                <button className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-3.5 rounded-lg transition shadow-lg">+ Add Slot</button>
                            </form>
                        </div>
                    )}

                    {/* 4. CONTENT AREA */}
                    
                    {/* A. UPCOMING APPOINTMENTS */}
                    {activeTab === 'upcoming' && (
                        <div className="space-y-4 animate-in fade-in">
                            {upcomingAppointments.length === 0 ? (
                                <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5 border-dashed"><p className="text-slate-500">No upcoming appointments found.</p></div>
                            ) : (
                                upcomingAppointments.map(app => (
                                    <div key={app.id} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-white/10 transition">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center text-2xl font-bold text-white shadow-lg">{new Date(app.date).getDate()}</div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white">{app.user.name}</h3>
                                                <p className="text-slate-400 text-sm">{new Date(app.date).toLocaleDateString('default', { month: 'long', year: 'numeric' })} • {app.schedule.start_time}</p>
                                                <p className="text-xs text-slate-500 mt-1">{app.schedule.hospital.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {app.status === 'pending' && (<><button onClick={() => handleStatus(app.id, 'confirmed')} className="bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white px-4 py-2 rounded-lg font-bold text-sm transition">Accept</button><button onClick={() => handleStatus(app.id, 'cancelled')} className="bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg font-bold text-sm transition">Decline</button></>)}
                                            {app.status === 'confirmed' && (<><span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-bold uppercase mr-2">Confirmed</span><button onClick={() => handleStatus(app.id, 'completed')} className="bg-teal-500 hover:bg-teal-400 text-slate-900 px-4 py-2 rounded-lg font-bold text-sm transition">✓ Mark Completed</button></>)}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* B. HISTORY */}
                    {activeTab === 'history' && (
                        <div className="bg-white/5 rounded-3xl overflow-hidden border border-white/10 shadow-xl animate-in fade-in">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-slate-400 uppercase text-xs tracking-wider"><tr><th className="p-5 font-semibold">Date</th><th className="p-5 font-semibold">Patient</th><th className="p-5 font-semibold">Status</th><th className="p-5 font-semibold">Hospital</th></tr></thead>
                                <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                                    {appointmentHistory.map(app => (
                                        <tr key={app.id} className="hover:bg-white/5 transition">
                                            <td className="p-5 font-mono text-white">{new Date(app.date).toLocaleDateString()}</td>
                                            <td className="p-5 font-bold text-white">{app.user.name}</td>
                                            <td className="p-5"><span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${app.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : app.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-slate-700 text-slate-400 border-slate-600'}`}>{app.status}</span></td>
                                            <td className="p-5 text-slate-500">{app.schedule.hospital.name}</td>
                                        </tr>
                                    ))}
                                    {appointmentHistory.length === 0 && <tr><td colSpan="4" className="p-10 text-center text-slate-500">No history found.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* C. ✅ ADDED: MY SCHEDULES CONTENT */}
                    {activeTab === 'schedules' && (
                        <div className="space-y-6 animate-in fade-in">
                            <div className="bg-white/5 rounded-3xl overflow-hidden border border-white/10 shadow-xl">
                                <table className="w-full text-left">
                                    <thead className="bg-white/5 text-slate-400 uppercase text-xs tracking-wider">
                                        <tr>
                                            <th className="p-5 font-semibold">Day</th>
                                            <th className="p-5 font-semibold">Time Slot</th>
                                            <th className="p-5 font-semibold">Hospital</th>
                                            <th className="p-5 font-semibold">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                                        {/* Uses 'mySchedules' passed from the backend */}
                                        {mySchedules && mySchedules.length > 0 ? (
                                            mySchedules.map(sch => (
                                                <tr key={sch.id} className="hover:bg-white/5 transition">
                                                    <td className="p-5 font-bold text-white">{sch.day}</td>
                                                    <td className="p-5 font-mono text-teal-400">{sch.start_time} - {sch.end_time}</td>
                                                    <td className="p-5 text-white">{sch.hospital.name}</td>
                                                    <td className="p-5"><span className="px-2 py-1 bg-green-500/10 text-green-400 rounded text-xs border border-green-500/20">Active</span></td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan="4" className="p-10 text-center text-slate-500">No availability slots added yet.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}