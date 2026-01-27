import { Head, useForm, router, Link } from '@inertiajs/react';
import { useState } from 'react';

/**
 * AdminDashboard Component
 * Centralized governance interface for medical staff orchestration,
 * patient data integrity, and facility logistics management.
 */
export default function AdminDashboard({ auth, doctors, patients, appointments, stats, hospitals }) {

    const [activeTab, setActiveTab] = useState('doctors');
    const [showAddDoctor, setShowAddDoctor] = useState(false);
    const [showAddHospital, setShowAddHospital] = useState(false);

    /**
     * Entity State Management
     * Tracks the specific resource targeted for modification within modal contexts.
     */
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [editingPatient, setEditingPatient] = useState(null);
    const [editingHospital, setEditingHospital] = useState(null);

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        specialization: '',
        bio: '',
        image: null,
        address: '',
    });

    /**
     * Specialist Provisioning
     * Validates and persists a new medical specialist account and profile.
     */
    const submitDoctor = (e) => {
        e.preventDefault();
        post(route('doctors.store'), {
            forceFormData: true,
            onSuccess: () => { reset(); setShowAddDoctor(false); },
        });
    };

    /**
     * Facility Registration
     * Adds a new clinical facility/hospital to the system geolocation directory.
     */
    const submitHospital = (e) => {
        e.preventDefault();
        post(route('hospitals.store'), {
            onSuccess: () => { reset(); setShowAddHospital(false); }
        });
    };

    /**
     * Specialist Profile Synchronization
     * Updates professional specialization and imagery for an existing doctor.
     */
    const handleUpdateDoctor = (e) => {
        e.preventDefault();
        post(route('doctor.profile.update'), {
            _method: 'post',
            specialization: data.specialization,
            image: data.image
        }, {
            onSuccess: () => setEditingDoctor(null)
        });
    };

    /**
     * Facility Data Update
     * Updates naming and physical address parameters for a clinical facility.
     */
    const handleUpdateHospital = (e) => {
        e.preventDefault();
        patch(route('hospitals.update', editingHospital.id), {
            name: data.name,
            address: data.address
        }, {
            onSuccess: () => setEditingHospital(null)
        });
    };

    /**
     * Patient Data Synchronization
     * Updates core identity records for a registered patient.
     */
    const handleUpdatePatient = (e) => {
        e.preventDefault();
        patch(route('profile.update'), data, {
            onSuccess: () => setEditingPatient(null)
        });
    };

    /**
     * Appointment State Transition
     * Forces an appointment lifecycle state to 'cancelled'.
     */
    const handleCancelAppointment = (id) => {
        if(confirm("Are you sure you want to terminate this appointment?")) {
            router.patch(route('appointments.status', id), { status: 'cancelled' });
        }
    }

    /**
     * Resource Termination
     * Permanently deletes a user or facility record from the persistent storage.
     */
    const handleDeleteResource = (id, resourceType) => {
        if(confirm(`Permanently remove ${resourceType} ID: ${id}?`)) {
            const endpoint = resourceType === 'Hospital' ? route('hospitals.destroy', id) : route('users.destroy', id);
            router.delete(endpoint);
        }
    }

    const handleLogout = (e) => { e.preventDefault(); router.post(route('logout')); };

    return (
        <>
            <Head title="System Administration" />

            <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-teal-500/30">

                {/* --- TOP NAVIGATION BAR --- */}
                <nav className="fixed z-50 w-full border-b border-white/5 bg-slate-900/60 backdrop-blur-xl">
                    <div className="flex items-center justify-between h-20 px-8 mx-auto max-w-[1600px]">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="flex items-center justify-center w-10 h-10 transition-transform bg-teal-500 rounded-xl group-hover:rotate-6">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                            </div>
                            <span className="text-xl font-bold tracking-tighter text-white">
                                MediFlow <span className="ml-1 text-[10px] uppercase text-teal-400 font-black tracking-[0.2em]">Internal</span>
                            </span>
                        </Link>

                        <div className="hidden p-1 space-x-2 border md:flex bg-black/20 rounded-2xl border-white/5">
                            {['doctors', 'patients', 'hospitals', 'appointments'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-teal-500 text-slate-900 shadow-lg shadow-teal-500/20' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex-col items-end hidden leading-none lg:flex">
                                <span className="text-xs font-bold tracking-widest text-white uppercase">{auth.user.name}</span>
                                <span className="text-[10px] text-teal-500 font-bold mt-1">Super Administrator</span>
                            </div>
                            <button onClick={handleLogout} className="p-2.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500 hover:text-white transition-all">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                            </button>
                        </div>
                    </div>
                </nav>

                <main className="px-8 pt-32 pb-20 mx-auto max-w-[1600px]">

                    {/* SYSTEM METRICS SECTION */}
                    <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-3">
                        {[
                            { label: 'Registered Specialists', val: stats.total_doctors, color: 'border-teal-500/20', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                            { label: 'Total Patient Accounts', val: stats.total_patients, color: 'border-blue-500/20', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                            { label: 'Active Appointments', val: stats.total_appointments, color: 'border-purple-500/20', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' }
                        ].map((stat, i) => (
                            <div key={i} className={`p-8 border bg-white/[0.02] backdrop-blur-md rounded-[2rem] ${stat.color} transition-all hover:bg-white/[0.04]`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{stat.label}</h3>
                                        <p className="mt-2 text-5xl font-black tracking-tighter text-white">{stat.val}</p>
                                    </div>
                                    <div className="flex items-center justify-center w-12 h-12 border rounded-2xl bg-white/5 border-white/5">
                                        <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon}/></svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="relative p-1 border bg-white/[0.02] border-white/5 rounded-[2.5rem]">

                        {/* 1. DOCTOR MANAGEMENT */}
                        {activeTab === 'doctors' && (
                            <div className="p-8 animate-in fade-in slide-in-from-bottom-4">
                                <div className="flex items-center justify-between mb-10">
                                    <div>
                                        <h2 className="text-3xl italic font-black tracking-tight text-white">Specialist Directory</h2>
                                        <p className="text-[10px] text-slate-500 mt-1 font-bold uppercase tracking-widest">Medical Personnel Administration</p>
                                    </div>
                                    <button onClick={() => setShowAddDoctor(!showAddDoctor)} className={`px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${showAddDoctor ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-teal-500 text-slate-900 shadow-xl'}`}>
                                        {showAddDoctor ? 'Abort Entry' : 'Enlist Specialist'}
                                    </button>
                                </div>

                                {showAddDoctor && (
                                    <div className="mb-12 p-10 bg-slate-800/40 border border-white/5 rounded-[2rem] animate-in zoom-in-95">
                                        <form onSubmit={submitDoctor} className="grid grid-cols-2 gap-8">
                                            <input type="text" placeholder="Full Name" className="w-full px-6 text-white border outline-none h-14 bg-black/30 border-white/10 rounded-2xl focus:ring-2 focus:ring-teal-500" value={data.name} onChange={e => setData('name', e.target.value)} required />
                                            <input type="email" placeholder="Email Address" className="w-full px-6 text-white border outline-none h-14 bg-black/30 border-white/10 rounded-2xl focus:ring-2 focus:ring-teal-500" value={data.email} onChange={e => setData('email', e.target.value)} required />
                                            <input type="password" placeholder="Access Password" className="w-full px-6 text-white border outline-none h-14 bg-black/30 border-white/10 rounded-2xl focus:ring-2 focus:ring-teal-500" value={data.password} onChange={e => setData('password', e.target.value)} required />
                                            <input type="text" placeholder="Discipline (e.g. Neurology)" className="w-full px-6 text-white border outline-none h-14 bg-black/30 border-white/10 rounded-2xl focus:ring-2 focus:ring-teal-500" value={data.specialization} onChange={e => setData('specialization', e.target.value)} required />
                                            <button className="col-span-2 h-16 font-black uppercase tracking-widest text-[10px] bg-teal-500 rounded-[1.25rem] text-slate-900 shadow-lg">Authenticate Account</button>
                                        </form>
                                    </div>
                                )}

                                <div className="overflow-hidden bg-black/20 rounded-[2rem] border border-white/5">
                                    <table className="w-full text-left">
                                        <thead className="bg-white/[0.03] text-[10px] uppercase font-black tracking-widest text-slate-500 border-b border-white/5">
                                            <tr><th className="p-6">Specialist</th><th className="p-6">Discipline</th><th className="p-6 text-right">Actions</th></tr>
                                        </thead>
                                        <tbody className="text-sm divide-y divide-white/5">
                                            {doctors.map(doc => (
                                                <tr key={doc.id} className="transition-colors hover:bg-white/[0.02]">
                                                    <td className="p-6 font-bold text-white">{doc.user.name}</td>
                                                    <td className="p-6"><span className="text-[10px] font-black uppercase tracking-wider text-teal-400">{doc.specialization}</span></td>
                                                    <td className="p-6 space-x-6 text-right">
                                                        <button onClick={() => {setEditingDoctor(doc); setData('specialization', doc.specialization);}} className="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300">Modify</button>
                                                        <button onClick={() => handleDeleteResource(doc.user.id, 'Doctor')} className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-300">Decommission</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* 2. PATIENT MANAGEMENT */}
                        {activeTab === 'patients' && (
                            <div className="p-8 animate-in fade-in slide-in-from-bottom-4">
                                <h2 className="mb-10 text-3xl italic font-black tracking-tight text-white">Patient Database</h2>
                                <div className="overflow-hidden bg-black/20 rounded-[2rem] border border-white/5">
                                    <table className="w-full text-left">
                                        <thead className="bg-white/[0.03] text-[10px] uppercase font-black tracking-widest text-slate-500 border-b border-white/5">
                                            <tr><th className="p-6">Patient Identity</th><th className="p-6">Email Access</th><th className="p-6 text-right">Operations</th></tr>
                                        </thead>
                                        <tbody className="text-sm divide-y divide-white/5">
                                            {patients.map(p => (
                                                <tr key={p.id} className="transition-colors hover:bg-white/[0.02]">
                                                    <td className="p-6 font-bold text-white">{p.name}</td>
                                                    <td className="p-6 text-slate-400">{p.email}</td>
                                                    <td className="p-6 space-x-6 text-right">
                                                        <button onClick={() => {setEditingPatient(p); setData({name: p.name, email: p.email});}} className="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300">Edit Records</button>
                                                        <button onClick={() => handleDeleteResource(p.id, 'Patient')} className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-300">Purge</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* 3. FACILITY OPERATIONS */}
                        {activeTab === 'hospitals' && (
                            <div className="p-8 animate-in fade-in slide-in-from-bottom-4">
                                <div className="flex items-center justify-between mb-10">
                                    <h2 className="text-3xl italic font-black leading-none text-white">Clinical Facilities</h2>
                                    <button onClick={() => setShowAddHospital(!showAddHospital)} className="bg-teal-500 px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-900 shadow-xl">
                                        {showAddHospital ? 'Abort' : 'Register Hub'}
                                    </button>
                                </div>

                                {showAddHospital && (
                                    <div className="p-10 mb-12 bg-slate-800/40 border border-white/5 rounded-[2rem] animate-in zoom-in-95">
                                        <form onSubmit={submitHospital} className="grid grid-cols-2 gap-8">
                                            <input type="text" placeholder="Facility Title" className="w-full px-6 text-white transition-all border outline-none h-14 bg-black/30 border-white/10 rounded-2xl focus:ring-2 focus:ring-teal-500" value={data.name} onChange={e => setData('name', e.target.value)} required />
                                            <input type="text" placeholder="Physical Address" className="w-full px-6 text-white transition-all border outline-none h-14 bg-black/30 border-white/10 rounded-2xl focus:ring-2 focus:ring-teal-500" value={data.address} onChange={e => setData('address', e.target.value)} required />
                                            <button className="col-span-full h-16 font-black uppercase tracking-widest text-[10px] bg-teal-500 rounded-[1.25rem] text-slate-900 shadow-lg">Confirm Registration</button>
                                        </form>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {hospitals?.map(h => (
                                        <div key={h.id} className="p-8 bg-white/[0.03] border border-white/5 rounded-[2.5rem] hover:bg-white/[0.05] transition-all group">
                                            <div className="flex items-start justify-between mb-4">
                                                <h3 className="text-xl font-black text-white">{h.name}</h3>
                                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-500/10">
                                                    <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                                </div>
                                            </div>
                                            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider leading-relaxed">{h.address}</p>
                                            <div className="flex gap-6 pt-6 mt-10 transition-opacity border-t opacity-0 border-white/5 group-hover:opacity-100">
                                                <button onClick={() => {setEditingHospital(h); setData({name: h.name, address: h.address});}} className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400 hover:text-white transition-colors">Adjust</button>
                                                <button onClick={() => handleDeleteResource(h.id, 'Hospital')} className="text-[9px] font-black uppercase tracking-[0.2em] text-red-400 hover:text-white transition-colors">Remove</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 4. APPOINTMENT OVERSIGHT */}
                        {activeTab === 'appointments' && (
                            <div className="p-8 animate-in fade-in slide-in-from-bottom-4">
                                <h2 className="mb-10 text-3xl italic font-black leading-none tracking-tight text-white">Global Appointment Logs</h2>
                                <div className="overflow-hidden bg-black/20 rounded-[2rem] border border-white/5">
                                    <table className="w-full text-left">
                                        <thead className="bg-white/[0.03] text-[10px] uppercase font-black tracking-widest text-slate-500 border-b border-white/5">
                                            <tr><th className="p-6">Schedule Date</th><th className="p-6">Doctor / Patient</th><th className="p-6">State</th><th className="p-6 text-right">Intervention</th></tr>
                                        </thead>
                                        <tbody className="text-sm divide-y divide-white/5">
                                            {appointments.map(app => (
                                                <tr key={app.id} className="transition-colors hover:bg-white/[0.02]">
                                                    <td className="p-6 font-mono font-bold text-white">{app.date}</td>
                                                    <td className="p-6">
                                                        <p className="text-teal-400 font-black text-[10px] uppercase">Dr. {app.doctor.user.name}</p>
                                                        <p className="mt-1 text-xs text-white">{app.user.name}</p>
                                                    </td>
                                                    <td className="p-6">
                                                        <span className="px-3 py-1 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-400">{app.status}</span>
                                                    </td>
                                                    <td className="p-6 text-right">
                                                        {app.status !== 'cancelled' && (
                                                            <button onClick={() => handleCancelAppointment(app.id)} className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/20 transition-all">Terminate</button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                    </div>
                </main>

                {/* --- UNIVERSAL MODALS --- */}

                {editingDoctor && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in zoom-in-95">
                        <div className="w-full max-w-lg p-12 border bg-slate-900 border-white/10 rounded-[3rem] shadow-2xl">
                            <h3 className="mb-8 text-2xl italic font-black text-white">Update Specialization</h3>
                            <form onSubmit={handleUpdateDoctor} className="space-y-8">
                                <input type="text" className="w-full px-6 text-white border outline-none h-14 bg-black/40 border-white/10 rounded-2xl focus:ring-2 focus:ring-teal-500" value={data.specialization} onChange={e => setData('specialization', e.target.value)} />
                                <div className="flex gap-4">
                                    <button type="submit" className="flex-1 h-14 font-black uppercase tracking-widest text-[10px] bg-teal-500 text-slate-900 rounded-2xl shadow-lg">Save Changes</button>
                                    <button type="button" onClick={() => setEditingDoctor(null)} className="flex-1 h-14 font-black uppercase tracking-widest text-[10px] bg-white/5 text-slate-400 rounded-2xl">Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {editingPatient && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in zoom-in-95">
                        <div className="w-full max-w-lg p-12 border bg-slate-900 border-white/10 rounded-[3rem] shadow-2xl">
                            <h3 className="mb-8 text-2xl italic font-black text-white">Edit Identity Records</h3>
                            <form onSubmit={handleUpdatePatient} className="space-y-8">
                                <input type="text" className="w-full px-6 text-white border outline-none h-14 bg-black/40 border-white/10 rounded-2xl" value={data.name} onChange={e => setData('name', e.target.value)} />
                                <input type="email" className="w-full px-6 text-white border outline-none h-14 bg-black/40 border-white/10 rounded-2xl" value={data.email} onChange={e => setData('email', e.target.value)} />
                                <div className="flex gap-4">
                                    <button type="submit" className="flex-1 h-14 font-black uppercase tracking-widest text-[10px] bg-teal-500 text-slate-900 rounded-2xl">Commit</button>
                                    <button type="button" onClick={() => setEditingPatient(null)} className="flex-1 h-14 font-black uppercase tracking-widest text-[10px] bg-white/5 text-slate-400 rounded-2xl">Dismiss</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {editingHospital && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in zoom-in-95">
                        <div className="w-full max-w-lg p-12 border bg-slate-900 border-white/10 rounded-[3rem] shadow-2xl">
                            <h3 className="mb-8 text-2xl italic font-black text-white">Logistics Update</h3>
                            <form onSubmit={handleUpdateHospital} className="space-y-8">
                                <input type="text" className="w-full px-6 text-white border outline-none h-14 bg-black/40 border-white/10 rounded-2xl" value={data.name} onChange={e => setData('name', e.target.value)} />
                                <input type="text" className="w-full px-6 text-white border outline-none h-14 bg-black/40 border-white/10 rounded-2xl" value={data.address} onChange={e => setData('address', e.target.value)} />
                                <div className="flex gap-4">
                                    <button type="submit" className="flex-1 h-14 font-black uppercase tracking-widest text-[10px] bg-teal-500 text-slate-900 rounded-2xl shadow-lg">Confirm</button>
                                    <button type="button" onClick={() => setEditingHospital(null)} className="flex-1 h-14 font-black uppercase tracking-widest text-[10px] bg-white/5 text-slate-400 rounded-2xl">Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
