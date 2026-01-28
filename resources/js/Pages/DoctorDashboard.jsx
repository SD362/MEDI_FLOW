import { Head, Link, router, usePage, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

/**
 * DoctorDashboard Component
 * * Centralized clinical interface for medical practitioners.
 * * Updates:
 * * - Added Clinical Finalization Modal (Diagnosis, Prescription, Follow-up).
 * * - Integrated Toast Notification system for all actions.
 */
export default function DoctorDashboard({ auth, appointments, hospitals, mySchedules }) {

    const { flash } = usePage().props;

    // --- UI State ---
    const [alertMessage, setAlertMessage] = useState(null);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [isWorkFormOpen, setIsWorkFormOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    // --- Action Modal State ---
    const [confirmModal, setConfirmModal] = useState(null);
    const [finalizeModal, setFinalizeModal] = useState(null); // Stores appointment object being finalized

    /**
     * Professional Identity State
     */
    const profileForm = useForm({
        specialization: auth.user.doctor?.specialization || '',
        bio: auth.user.doctor?.bio || '',
        image: null,
    });

    /**
     * Clinical Data Form (For Finalization)
     */
    const clinicalForm = useForm({
        diagnosis: '',
        prescription: '',
        notes: '', // Lifestyle advice or internal notes
        next_visit_date: '',
        status: 'completed'
    });

    /**
     * Logistics State
     */
    const [scheduleData, setScheduleData] = useState({
        hospital_id: hospitals && hospitals.length > 0 ? hospitals[0].id : '',
        day: 'Monday',
        start_time: '',
        end_time: '',
    });

    /**
     * Notification Trigger Logic
     */
    useEffect(() => {
        if (flash?.message) {
            triggerNotification(flash.message);
        }
    }, [flash]);

    const triggerNotification = (msg) => {
        setAlertMessage(msg);
        setTimeout(() => setAlertMessage(null), 4000);
    };

    /**
     * Data Segmentation
     */
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingAppointments = appointments?.filter(app => {
        const appDate = new Date(app.date);
        return (app.status === 'pending' || app.status === 'confirmed') && appDate >= today;
    }) || [];

    const appointmentHistory = appointments?.filter(app => {
        const appDate = new Date(app.date);
        return app.status === 'completed' || app.status === 'cancelled' || appDate < today;
    }) || [];

    /**
     * Action: Initialize Status Change (Authorize/Discard)
     */
    const initiateStatusChange = (id, newStatus) => {
        // If completing, we use the specific Finalize Modal instead
        if(newStatus === 'completed') return;

        const actionType = newStatus === 'confirmed' ? 'Authorize' : 'Discard';
        setConfirmModal({
            type: 'status',
            id: id,
            payload: newStatus,
            title: `${actionType} Consultation?`,
            message: `You are about to change the status to ${newStatus.toUpperCase()}. This will update the patient's records immediately.`,
            color: newStatus === 'cancelled' ? 'red' : 'teal'
        });
    };

    /**
     * Action: Initialize Finalization (Opens Clinical Form)
     */
    const openFinalizeModal = (appointment) => {
        setFinalizeModal(appointment);
        clinicalForm.reset();
    };

    /**
     * Action: Submit Clinical Data & Complete Appointment
     */
    const submitFinalization = (e) => {
        e.preventDefault();
        // Submits the clinical data (Diagnosis, Meds, Date) to the backend
        clinicalForm.patch(route('appointments.update', finalizeModal.id), {
            onSuccess: () => {
                setFinalizeModal(null);
                triggerNotification("Consultation finalized & prescription sent to patient.");
            }
        });
    };

    /**
     * Action: Execute Confirmed Action (Simple Status/Delete)
     */
    const executeAction = () => {
        if (!confirmModal) return;

        if (confirmModal.type === 'status') {
            router.patch(route('appointments.status', confirmModal.id), { status: confirmModal.payload }, {
                onSuccess: () => {
                    setConfirmModal(null);
                    triggerNotification(`Status updated to ${confirmModal.payload.toUpperCase()}.`);
                }
            });
        } else if (confirmModal.type === 'delete') {
            router.delete(route('schedules.destroy', confirmModal.id), {
                onSuccess: () => {
                    setConfirmModal(null);
                    triggerNotification("Slot decommissioned successfully.");
                }
            });
        }
    };

    const submitProfile = (e) => {
        e.preventDefault();
        profileForm.post(route('doctor.profile.update'), {
            forceFormData: true,
            onSuccess: () => {
                setIsProfileModalOpen(false);
                profileForm.reset('image');
                triggerNotification("Profile synchronized successfully.");
            },
        });
    };

    const submitSchedule = (e) => {
        e.preventDefault();
        router.post(route('schedules.store'), scheduleData, {
            onSuccess: () => {
                setIsWorkFormOpen(false);
                setActiveTab('schedules');
                triggerNotification("Availability slot registered.");
            }
        });
    };

    const initiateDeleteSchedule = (id) => {
        setConfirmModal({
            type: 'delete',
            id: id,
            title: "Decommission Slot?",
            message: "This action is permanent. The availability slot will be removed from the public registry.",
            color: 'red'
        });
    };

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    return (
        <>
            <Head title="Clinical Command Center" />

            <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-teal-500/30">

                {/* --- NOTIFICATION TOAST --- */}
                {alertMessage && (
                    <div className="fixed z-[100] top-24 left-1/2 -translate-x-1/2 animate-in slide-in-from-top-4 duration-300">
                        <div className="flex items-center gap-3 px-6 py-3 font-black text-[10px] uppercase tracking-widest bg-teal-500 border border-teal-400 shadow-2xl text-slate-900 rounded-2xl">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                            {alertMessage}
                        </div>
                    </div>
                )}

                {/* --- NAVIGATION --- */}
                <nav className="fixed z-50 w-full border-b border-white/5 bg-slate-900/60 backdrop-blur-xl">
                    <div className="flex items-center justify-between h-20 px-8 mx-auto max-w-[1600px]">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="flex items-center justify-center w-10 h-10 transition-transform bg-teal-500 shadow-lg rounded-xl group-hover:rotate-6 shadow-teal-500/20">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                            </div>
                            <span className="text-xl font-bold tracking-tighter text-white uppercase">MediFlow <span className="text-teal-500 text-[10px] font-black tracking-[0.3em] ml-1">Clinical</span></span>
                        </Link>

                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsProfileModalOpen(true)} className="flex items-center gap-2 px-4 py-2 transition border rounded-xl bg-white/[0.03] border-white/10 hover:bg-white/5">
                                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sync Profile</span>
                            </button>
                            <div className="flex-col items-end hidden px-4 leading-none lg:flex">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Practitioner</span>
                                <span className="mt-1 text-xs font-bold text-white uppercase">Dr. {auth.user.name}</span>
                            </div>
                            <button onClick={handleLogout} className="p-2.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500 hover:text-white transition-all">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                            </button>
                        </div>
                    </div>
                </nav>

                <main className="px-8 pt-32 pb-20 mx-auto max-w-[1600px]">
                    {/* ... (Metrics section remains same) ... */}
                    <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-3">
                        {[
                            { label: 'Pending Requests', val: appointments?.filter(a => a.status === 'pending').length, color: 'text-yellow-400', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                            { label: 'Upcoming Consultations', val: upcomingAppointments.length, color: 'text-white', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                            { label: 'Clinical History', val: appointments?.filter(a => a.status === 'completed').length, color: 'text-teal-400', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' }
                        ].map((stat, i) => (
                            <div key={i} className="p-8 border bg-white/[0.02] backdrop-blur-md rounded-[2rem] border-white/5 shadow-xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{stat.label}</h3>
                                        <p className={`mt-2 text-5xl font-black tracking-tighter ${stat.color}`}>{stat.val || 0}</p>
                                    </div>
                                    <div className="flex items-center justify-center w-12 h-12 border rounded-2xl bg-white/5 border-white/5">
                                        <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon}/></svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Module Controls */}
                    <div className="flex flex-col items-center justify-between gap-4 mb-8 md:flex-row">
                        <div className="flex p-1 space-x-1 border bg-black/20 rounded-[1.25rem] border-white/5">
                            {['upcoming', 'history', 'schedules'].map((t) => (
                                <button key={t} onClick={() => setActiveTab(t)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-teal-500 text-slate-900 shadow-lg' : 'text-slate-500 hover:text-white'}`}>{t}</button>
                            ))}
                        </div>
                        <button onClick={() => setIsWorkFormOpen(!isWorkFormOpen)} className="flex items-center gap-3 px-6 py-3 font-black text-[10px] uppercase tracking-widest text-white transition-all border bg-white/5 border-white/10 hover:bg-white/10 rounded-2xl">
                            <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            {isWorkFormOpen ? 'Close Logistics' : 'Configure Availability'}
                        </button>
                    </div>

                    {/* Schedule Form */}
                    {isWorkFormOpen && (
                        <div className="p-10 mb-10 border bg-slate-800/40 backdrop-blur-xl rounded-[2.5rem] border-white/5 animate-in slide-in-from-top-4">
                            <h3 className="mb-8 text-xl italic font-black text-white">Register Availability Slot</h3>
                            <form onSubmit={submitSchedule} className="grid items-end grid-cols-1 gap-8 md:grid-cols-4">
                                <div>
                                    <label className="block mb-2 text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Facility Hub</label>
                                    <select className="w-full px-6 text-white transition-all border outline-none appearance-none cursor-pointer h-14 bg-black/20 border-white/10 rounded-2xl focus:ring-2 focus:ring-teal-500" value={scheduleData.hospital_id} onChange={(e) => setScheduleData({...scheduleData, hospital_id: e.target.value})}>
                                        {hospitals?.map(h => <option key={h.id} value={h.id} className="bg-slate-900">{h.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-2 text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Operational Day</label>
                                    <select className="w-full px-6 text-white transition-all border outline-none appearance-none cursor-pointer h-14 bg-black/20 border-white/10 rounded-2xl focus:ring-2 focus:ring-teal-500" value={scheduleData.day} onChange={(e) => setScheduleData({...scheduleData, day: e.target.value})}>
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => <option key={d} value={d} className="bg-slate-900">{d}</option>)}
                                    </select>
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block mb-2 text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Time window (Start - End)</label>
                                    <div className="flex gap-4">
                                        <input type="time" className="w-full px-4 text-white transition-all border outline-none h-14 bg-black/20 border-white/10 rounded-2xl focus:ring-2 focus:ring-teal-500" onChange={(e) => setScheduleData({...scheduleData, start_time: e.target.value})} required />
                                        <input type="time" className="w-full px-4 text-white transition-all border outline-none h-14 bg-black/20 border-white/10 rounded-2xl focus:ring-2 focus:ring-teal-500" onChange={(e) => setScheduleData({...scheduleData, end_time: e.target.value})} required />
                                    </div>
                                </div>
                                <button className="h-14 bg-teal-500 hover:bg-teal-400 text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all active:scale-95">Authorize Slot</button>
                            </form>
                        </div>
                    )}

                    {/* --- MAIN DATA VIEWS --- */}
                    <div className="relative p-1 border bg-white/[0.02] border-white/5 rounded-[2.5rem]">

                        {/* Upcoming Tab */}
                        {activeTab === 'upcoming' && (
                            <div className="p-8 space-y-4 animate-in fade-in">
                                {upcomingAppointments.length === 0 ? (
                                    <div className="py-20 text-center border border-dashed rounded-[2rem] border-white/5">
                                        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600 italic">No Active Consultations Found</p>
                                    </div>
                                ) : (
                                    upcomingAppointments.map(app => (
                                        <div key={app.id} className="flex flex-col items-center justify-between gap-6 p-8 transition-all border bg-white/[0.02] border-white/5 rounded-3xl md:flex-row hover:bg-white/[0.04]">
                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center justify-center w-16 h-16 text-2xl italic font-black text-white shadow-2xl bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl">{new Date(app.date).getDate()}</div>
                                                <div>
                                                    <h3 className="text-lg font-black tracking-tight text-white">{app.user.name}</h3>
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">{new Date(app.date).toLocaleDateString('default', { month: 'long', year: 'numeric' })} • {app.schedule?.start_time}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {app.status === 'pending' && (
                                                    <>
                                                        <button onClick={() => initiateStatusChange(app.id, 'confirmed')} className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-teal-400 transition rounded-xl bg-teal-500/10 hover:bg-teal-500 hover:text-slate-900 border border-teal-500/20">Authorize</button>
                                                        <button onClick={() => initiateStatusChange(app.id, 'cancelled')} className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-red-400 transition rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20">Discard</button>
                                                    </>
                                                )}
                                                {app.status === 'confirmed' && (
                                                    <>
                                                        <span className="px-4 py-1.5 text-[9px] font-black text-blue-400 uppercase tracking-widest rounded-lg bg-blue-500/10 border border-blue-500/20 mr-2 italic">Validated</span>
                                                        {/* ✅ Opens the Clinical Form instead of direct completion */}
                                                        <button onClick={() => openFinalizeModal(app)} className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest bg-teal-500 rounded-xl text-slate-900 hover:scale-105 transition-all shadow-lg shadow-teal-500/20">Finalize & Report</button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* History Tab */}
                        {activeTab === 'history' && (
                            <div className="overflow-hidden bg-black/20 rounded-[2rem] border border-white/5 animate-in fade-in">
                                <table className="w-full text-left">
                                    <thead className="bg-white/[0.03] text-[10px] uppercase font-black tracking-widest text-slate-500 border-b border-white/5">
                                        <tr><th className="p-6">Execution Date</th><th className="p-6">Patient Entity</th><th className="p-6">Final State</th><th className="p-6">Hub</th></tr>
                                    </thead>
                                    <tbody className="text-sm divide-y divide-white/5 text-slate-300">
                                        {appointmentHistory.map(app => (
                                            <tr key={app.id} className="transition-colors hover:bg-white/[0.02]">
                                                <td className="p-6 font-mono text-[11px] uppercase tracking-tighter text-slate-500">{new Date(app.date).toLocaleDateString()}</td>
                                                <td className="p-6 italic font-black text-white">{app.user.name}</td>
                                                <td className="p-6">
                                                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${app.status === 'completed' ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>{app.status}</span>
                                                </td>
                                                <td className="p-6 text-[11px] font-bold text-slate-600 uppercase">{app.schedule?.hospital?.name}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Schedules Tab */}
                        {activeTab === 'schedules' && (
                            <div className="overflow-hidden bg-black/20 rounded-[2rem] border border-white/5 animate-in fade-in">
                                <table className="w-full text-left">
                                    <thead className="bg-white/[0.03] text-[10px] uppercase font-black tracking-widest text-slate-500 border-b border-white/5">
                                        <tr><th className="p-6">Cyclical Day</th><th className="p-6">Operational Window</th><th className="p-6">Hub</th><th className="p-6 text-right">Actions</th></tr>
                                    </thead>
                                    <tbody className="text-sm divide-y divide-white/5 text-slate-300">
                                        {mySchedules?.map(sch => (
                                            <tr key={sch.id} className="transition-colors hover:bg-white/[0.02] group">
                                                <td className="p-6 italic font-black text-white">{sch.day}</td>
                                                <td className="p-6 font-mono text-[11px] text-teal-400 uppercase tracking-widest">{sch.start_time} — {sch.end_time}</td>
                                                <td className="p-6 text-[11px] font-bold text-slate-500 uppercase">{sch.hospital?.name}</td>
                                                <td className="p-6 text-right">
                                                    <button onClick={() => initiateDeleteSchedule(sch.id)} className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-red-500 transition border border-red-500/20 rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-white">Decommission Slot</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </main>

                {/* --- PROFILE MODAL --- */}
                {isProfileModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in zoom-in-95">
                        <div className="w-full max-w-lg p-12 border bg-slate-900 border-white/10 rounded-[3rem] shadow-2xl">
                            <h3 className="mb-8 text-2xl italic font-black text-white">Synchronize Profile</h3>
                            <form onSubmit={submitProfile} className="space-y-8">
                                <div>
                                    <label className="block mb-3 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Validated Specialization</label>
                                    <input type="text" className="w-full px-6 text-white transition-all border outline-none h-14 bg-black/40 border-white/10 rounded-2xl focus:ring-2 focus:ring-teal-500" value={profileForm.data.specialization} onChange={e => profileForm.setData('specialization', e.target.value)} />
                                </div>
                                <div>
                                    <label className="block mb-3 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Clinical Biography</label>
                                    <textarea className="w-full h-32 p-6 text-sm text-white transition-all border outline-none resize-none bg-black/40 border-white/10 rounded-2xl focus:ring-2 focus:ring-teal-500" value={profileForm.data.bio} onChange={e => profileForm.setData('bio', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Identify Asset (Portrait)</label>
                                    <div className="relative h-16 group">
                                        <input type="file" className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer" onChange={e => profileForm.setData('image', e.target.files[0])} />
                                        <div className="flex items-center justify-between h-full px-6 transition-all border bg-black/40 border-white/10 rounded-2xl group-hover:border-teal-500/50">
                                            <span className="text-[10px] font-black uppercase bg-teal-500/20 text-teal-400 px-4 py-1.5 rounded-xl border border-teal-500/20">Choose File</span>
                                            <span className="text-[10px] font-bold truncate text-slate-500 max-w-[200px]">{profileForm.data.image ? profileForm.data.image.name : 'No file detected'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button type="submit" disabled={profileForm.processing} className="flex-1 h-14 font-bold uppercase tracking-[0.2em] text-[11px] bg-teal-500 text-slate-900 rounded-[1.25rem] shadow-[0_0_20px_rgba(20,184,166,0.4)] hover:bg-teal-400 active:scale-95 transition-all disabled:opacity-50">{profileForm.processing ? 'Syncing...' : 'COMMIT CHANGES'}</button>
                                    <button type="button" onClick={() => setIsProfileModalOpen(false)} className="flex-1 h-14 font-bold uppercase tracking-[0.2em] text-[11px] bg-white/[0.03] border border-white/5 text-slate-400 rounded-[1.25rem] hover:bg-white/10 active:scale-95 transition-all">ABORT</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* --- ✅ NEW: CLINICAL FINALIZATION MODAL --- */}
                {finalizeModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in zoom-in-95">
                        <div className="w-full max-w-2xl p-12 border bg-slate-900 border-white/10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                             {/* Decorative Glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[80px] -z-10"></div>

                            <h3 className="mb-2 text-2xl italic font-black text-white">Clinical Report</h3>
                            <p className="mb-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Finalizing consultation for {finalizeModal.user.name}</p>

                            <form onSubmit={submitFinalization} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="md:col-span-2">
                                        <label className="block mb-2 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Medical Diagnosis</label>
                                        <textarea
                                            required
                                            className="w-full h-24 p-5 text-sm text-white transition-all border outline-none resize-none bg-black/40 border-white/10 rounded-2xl focus:ring-2 focus:ring-teal-500 placeholder-white/20"
                                            placeholder="Primary clinical findings..."
                                            value={clinicalForm.data.diagnosis}
                                            onChange={e => clinicalForm.setData('diagnosis', e.target.value)}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block mb-2 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Prescription / Regimen</label>
                                        <textarea
                                            required
                                            className="w-full h-32 p-5 text-sm text-white transition-all border outline-none resize-none bg-black/40 border-white/10 rounded-2xl focus:ring-2 focus:ring-teal-500 placeholder-white/20"
                                            placeholder="Medication, dosage, and frequency..."
                                            value={clinicalForm.data.prescription}
                                            onChange={e => clinicalForm.setData('prescription', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Clinical Notes (Private)</label>
                                        <input
                                            type="text"
                                            className="w-full px-6 text-sm text-white transition-all border outline-none h-14 bg-black/40 border-white/10 rounded-2xl focus:ring-2 focus:ring-teal-500"
                                            value={clinicalForm.data.notes}
                                            onChange={e => clinicalForm.setData('notes', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Next Review Date</label>
                                        <input
                                            type="date"
                                            className="w-full px-6 text-sm text-white uppercase transition-all border outline-none h-14 bg-black/40 border-white/10 rounded-2xl focus:ring-2 focus:ring-teal-500"
                                            min={new Date().toISOString().split('T')[0]}
                                            value={clinicalForm.data.next_visit_date}
                                            onChange={e => clinicalForm.setData('next_visit_date', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-4">
                                    <button
                                        type="submit"
                                        disabled={clinicalForm.processing}
                                        className="flex-1 h-14 font-bold uppercase tracking-[0.2em] text-[11px] bg-teal-500 text-slate-900 rounded-[1.25rem] shadow-[0_0_20px_rgba(20,184,166,0.4)] hover:bg-teal-400 active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        {clinicalForm.processing ? 'Signing...' : 'SUBMIT & CLOSE CASE'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFinalizeModal(null)}
                                        className="flex-1 h-14 font-bold uppercase tracking-[0.2em] text-[11px] bg-white/[0.03] border border-white/5 text-slate-400 rounded-[1.25rem] hover:bg-white/10 active:scale-95 transition-all"
                                    >
                                        CANCEL
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* --- UNIVERSAL ACTION CONFIRMATION MODAL --- */}
                {confirmModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in zoom-in-95">
                        <div className={`w-full max-w-md p-10 border bg-slate-900 rounded-[3rem] shadow-2xl ${confirmModal.color === 'red' ? 'border-red-500/20' : 'border-teal-500/20'}`}>
                            <div className={`absolute top-0 left-0 w-full h-full blur-[80px] -z-10 ${confirmModal.color === 'red' ? 'bg-red-500/5' : 'bg-teal-500/5'}`}></div>
                            <h3 className="mb-4 text-2xl italic font-black text-white">{confirmModal.title}</h3>
                            <p className="mb-8 text-xs font-medium leading-relaxed text-slate-400">{confirmModal.message}</p>
                            <div className="flex gap-4">
                                <button
                                    onClick={executeAction}
                                    className={`flex-1 h-14 font-bold uppercase tracking-[0.2em] text-[11px] text-white rounded-[1.25rem] shadow-xl active:scale-95 transition-all ${confirmModal.color === 'red' ? 'bg-red-500 hover:bg-red-400' : 'bg-teal-500 text-slate-900 hover:bg-teal-400'}`}
                                >
                                    CONFIRM
                                </button>
                                <button
                                    onClick={() => setConfirmModal(null)}
                                    className="flex-1 h-14 font-bold uppercase tracking-[0.2em] text-[11px] bg-white/[0.03] border border-white/5 text-slate-400 rounded-[1.25rem] hover:bg-white/10 active:scale-95 transition-all"
                                >
                                    ABORT
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </>
    );
}
