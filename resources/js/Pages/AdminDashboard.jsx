import { Head, useForm, router, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminDashboard({ auth, doctors, patients, appointments, stats }) {
    
    // --- STATE MANAGEMENT ---
    const [activeTab, setActiveTab] = useState('doctors'); // Tabs: 'doctors', 'patients', 'appointments'
    const [showAddDoctor, setShowAddDoctor] = useState(false);

    // --- FORM: Add New Doctor ---
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        specialization: '',
        bio: '',
        image: null,
    });

    const submitDoctor = (e) => {
        e.preventDefault();
        post(route('doctors.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setShowAddDoctor(false);
                alert("New Specialist Added Successfully!");
            },
        });
    };

    // --- ACTIONS: Delete Logic ---
    const handleDeleteUser = (id, role) => {
        if(confirm(`Are you sure you want to remove this ${role}? This action cannot be undone.`)) {
            router.delete(route('users.destroy', id));
        }
    }

    const handleDeleteAppointment = (id) => {
        if(confirm("Permanently delete this appointment record?")) {
            router.delete(route('appointments.destroy', id));
        }
    }

    // --- LOGOUT LOGIC ---
    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    return (
        <>
            <Head title="Admin Dashboard" />
            
            {/* ✅ MAIN WRAPPER: Deep Navy Background */}
            <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-teal-500 selection:text-white">

                {/* --- NAVIGATION BAR (Matches Home Page) --- */}
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
                                    <span className="ml-2 text-[10px] uppercase tracking-widest border border-slate-600 px-2 py-0.5 rounded text-slate-400">Admin</span>
                                </span>
                            </Link>

                            {/* Center Links (Home Access) */}
                            <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-300">
                                <Link href="/" className="hover:text-teal-400 transition">Home</Link>
                                <span className="text-slate-600">|</span>
                                <button onClick={() => setActiveTab('doctors')} className={`hover:text-teal-400 transition ${activeTab === 'doctors' ? 'text-teal-400' : ''}`}>Doctors</button>
                                <button onClick={() => setActiveTab('patients')} className={`hover:text-teal-400 transition ${activeTab === 'patients' ? 'text-teal-400' : ''}`}>Patients</button>
                                <button onClick={() => setActiveTab('appointments')} className={`hover:text-teal-400 transition ${activeTab === 'appointments' ? 'text-teal-400' : ''}`}>Appointments</button>
                            </div>

                            {/* Right Actions */}
                            <div className="flex items-center gap-4">
                                <span className="text-slate-400 text-sm hidden sm:block">Administrator</span>
                                <form onSubmit={handleLogout}>
                                    <button 
                                        type="submit"
                                        className="px-5 py-2 bg-red-500/10 border border-red-500/50 text-red-400 rounded-full text-sm font-bold hover:bg-red-500 hover:text-white transition"
                                    >
                                        Log Out
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* --- DASHBOARD CONTENT --- */}
                <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    
                    {/* 1. STATS OVERVIEW CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {/* Doctors Stat */}
                        <div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition text-6xl">👨‍⚕️</div>
                            <h3 className="text-slate-400 text-xs uppercase font-bold tracking-wider">Medical Staff</h3>
                            <p className="text-4xl font-extrabold text-white mt-2">{stats.total_doctors}</p>
                            <p className="text-xs text-teal-400 mt-2">Active Specialists</p>
                        </div>

                        {/* Patients Stat */}
                        <div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition text-6xl">👥</div>
                            <h3 className="text-slate-400 text-xs uppercase font-bold tracking-wider">Total Patients</h3>
                            <p className="text-4xl font-extrabold text-teal-400 mt-2">{stats.total_patients}</p>
                            <p className="text-xs text-slate-400 mt-2">Registered Users</p>
                        </div>

                        {/* Appointments Stat */}
                        <div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition text-6xl">📅</div>
                            <h3 className="text-slate-400 text-xs uppercase font-bold tracking-wider">System Activity</h3>
                            <p className="text-4xl font-extrabold text-blue-400 mt-2">{stats.total_appointments}</p>
                            <p className="text-xs text-slate-400 mt-2">Total Appointments</p>
                        </div>
                    </div>

                    {/* 2. MANAGEMENT TABS */}
                    <div className="flex space-x-6 border-b border-white/10 mb-8">
                        {[
                            { id: 'doctors', label: 'Manage Doctors' },
                            { id: 'patients', label: 'Manage Patients' },
                            { id: 'appointments', label: 'All Appointments' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`pb-4 px-2 text-sm font-bold uppercase tracking-wide transition border-b-2 ${
                                    activeTab === tab.id
                                    ? 'border-teal-500 text-teal-400' 
                                    : 'border-transparent text-slate-500 hover:text-white'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* --- TAB 1: DOCTORS MANAGEMENT --- */}
                    {activeTab === 'doctors' && (
                        <div className="animate-in fade-in duration-500">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">Medical Specialists</h2>
                                <button 
                                    onClick={() => setShowAddDoctor(!showAddDoctor)}
                                    className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold px-5 py-2.5 rounded-xl transition shadow-lg shadow-teal-500/20 flex items-center gap-2"
                                >
                                    {showAddDoctor ? 'Close Form' : (
                                        <><span>+</span> Add New Doctor</>
                                    )}
                                </button>
                            </div>

                            {/* Add Doctor Form */}
                            {showAddDoctor && (
                                <div className="mb-8 p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl animate-in slide-in-from-top-4">
                                    <h3 className="text-lg font-bold text-white mb-6">Register New Specialist</h3>
                                    <form onSubmit={submitDoctor} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        
                                        <div className="col-span-1">
                                            <input type="text" placeholder="Full Name" className="w-full bg-slate-950/50 border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none transition" value={data.name} onChange={e => setData('name', e.target.value)} />
                                            {errors.name && <div className="text-red-400 text-xs mt-1">{errors.name}</div>}
                                        </div>

                                        <div className="col-span-1">
                                            <input type="email" placeholder="Email Address" className="w-full bg-slate-950/50 border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none transition" value={data.email} onChange={e => setData('email', e.target.value)} />
                                            {errors.email && <div className="text-red-400 text-xs mt-1">{errors.email}</div>}
                                        </div>

                                        <div className="col-span-1">
                                            <input type="password" placeholder="Set Password" className="w-full bg-slate-950/50 border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none transition" value={data.password} onChange={e => setData('password', e.target.value)} />
                                            {errors.password && <div className="text-red-400 text-xs mt-1">{errors.password}</div>}
                                        </div>

                                        <div className="col-span-1">
                                            <input type="text" placeholder="Specialization (e.g. Cardiologist)" className="w-full bg-slate-950/50 border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none transition" value={data.specialization} onChange={e => setData('specialization', e.target.value)} />
                                            {errors.specialization && <div className="text-red-400 text-xs mt-1">{errors.specialization}</div>}
                                        </div>

                                        <div className="md:col-span-2">
                                            <textarea placeholder="Doctor's Bio" rows="3" className="w-full bg-slate-950/50 border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none transition" value={data.bio} onChange={e => setData('bio', e.target.value)}></textarea>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm text-slate-400 mb-2">Profile Photo</label>
                                            <input type="file" className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-500/10 file:text-teal-400 hover:file:bg-teal-500/20 transition cursor-pointer" onChange={e => setData('image', e.target.files[0])} />
                                        </div>

                                        <div className="md:col-span-2 pt-2">
                                            <button disabled={processing} className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white py-3.5 rounded-xl font-bold transition shadow-lg">
                                                {processing ? 'Creating Account...' : 'Create Doctor Account'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Doctors Table */}
                            <div className="bg-white/5 rounded-3xl overflow-hidden border border-white/10 shadow-xl">
                                <table className="w-full text-left">
                                    <thead className="bg-white/5 text-slate-400 uppercase text-xs tracking-wider">
                                        <tr>
                                            <th className="p-5 font-semibold">Doctor</th>
                                            <th className="p-5 font-semibold">Specialization</th>
                                            <th className="p-5 font-semibold">Email</th>
                                            <th className="p-5 font-semibold text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                                        {doctors.map(doc => (
                                            <tr key={doc.id} className="hover:bg-white/5 transition">
                                                <td className="p-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-lg">👨‍⚕️</div>
                                                        <span className="font-bold text-white">{doc.user.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-5">
                                                    <span className="bg-teal-500/10 text-teal-400 px-3 py-1 rounded-full text-xs font-bold border border-teal-500/20">{doc.specialization}</span>
                                                </td>
                                                <td className="p-5">{doc.user.email}</td>
                                                <td className="p-5 text-right">
                                                    <button onClick={() => handleDeleteUser(doc.user.id, 'Doctor')} className="text-red-400 hover:text-white hover:bg-red-500 px-4 py-2 rounded-lg transition text-xs font-bold uppercase border border-red-500/30">
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* --- TAB 2: PATIENTS MANAGEMENT --- */}
                    {activeTab === 'patients' && (
                        <div className="animate-in fade-in duration-500">
                            <h2 className="text-2xl font-bold text-white mb-6">Registered Patients</h2>
                            <div className="bg-white/5 rounded-3xl overflow-hidden border border-white/10 shadow-xl">
                                <table className="w-full text-left">
                                    <thead className="bg-white/5 text-slate-400 uppercase text-xs tracking-wider">
                                        <tr>
                                            <th className="p-5 font-semibold">ID</th>
                                            <th className="p-5 font-semibold">Name</th>
                                            <th className="p-5 font-semibold">Email</th>
                                            <th className="p-5 font-semibold">Joined Date</th>
                                            <th className="p-5 font-semibold text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                                        {patients.map(patient => (
                                            <tr key={patient.id} className="hover:bg-white/5 transition">
                                                <td className="p-5 text-slate-500">#{patient.id}</td>
                                                <td className="p-5 font-bold text-white">{patient.name}</td>
                                                <td className="p-5">{patient.email}</td>
                                                <td className="p-5 text-slate-400">{new Date(patient.created_at).toLocaleDateString()}</td>
                                                <td className="p-5 text-right">
                                                    <button onClick={() => handleDeleteUser(patient.id, 'Patient')} className="text-red-400 hover:text-white hover:bg-red-500 px-4 py-2 rounded-lg transition text-xs font-bold uppercase border border-red-500/30">
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {patients.length === 0 && (
                                            <tr><td colSpan="5" className="p-10 text-center text-slate-500">No patients registered yet.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* --- TAB 3: APPOINTMENTS MANAGEMENT --- */}
                    {activeTab === 'appointments' && (
                        <div className="animate-in fade-in duration-500">
                            <h2 className="text-2xl font-bold text-white mb-6">All System Appointments</h2>
                            <div className="bg-white/5 rounded-3xl overflow-hidden border border-white/10 shadow-xl">
                                <table className="w-full text-left">
                                    <thead className="bg-white/5 text-slate-400 uppercase text-xs tracking-wider">
                                        <tr>
                                            <th className="p-5 font-semibold">Date</th>
                                            <th className="p-5 font-semibold">Doctor</th>
                                            <th className="p-5 font-semibold">Patient</th>
                                            <th className="p-5 font-semibold">Status</th>
                                            <th className="p-5 font-semibold text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                                        {appointments.map(app => (
                                            <tr key={app.id} className="hover:bg-white/5 transition">
                                                <td className="p-5 font-mono text-white">{app.date}</td>
                                                <td className="p-5 text-teal-400 font-bold">{app.doctor.user.name}</td>
                                                <td className="p-5">{app.user.name}</td>
                                                <td className="p-5">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                                                        app.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                        app.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                        'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                    }`}>
                                                        {app.status}
                                                    </span>
                                                </td>
                                                <td className="p-5 text-right">
                                                    <button onClick={() => handleDeleteAppointment(app.id)} className="text-red-400 hover:text-white hover:bg-red-500 px-4 py-2 rounded-lg transition text-xs font-bold uppercase border border-red-500/30">
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {appointments.length === 0 && (
                                            <tr><td colSpan="5" className="p-10 text-center text-slate-500">No appointments found.</td></tr>
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