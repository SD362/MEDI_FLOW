import { Link, Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

/**
 * PatientDashboard Component
 * * The central command node for authenticated patients.
 * * Layout Order: Search -> Doctor Booking -> Active Consultations -> History
 */
export default function PatientDashboard({ auth, doctors, filters, specialties, myAppointments }) {

    const { flash } = usePage().props;

    // --- UI & Interaction State ---
    const [alertMessage, setAlertMessage] = useState(null);
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);

    // --- Calendar & Dataset State ---
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [notifications, setNotifications] = useState([]);

    // --- Modal Interface State ---
    const [bookingModal, setBookingModal] = useState(null);
    const [cancelModalId, setCancelModalId] = useState(null);

    const todayISO = new Date().toISOString().split('T')[0];

    /**
     * Feedback Loop: Flash Messages
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
     * Data Logic: Appointment Segmentation
     */
    const activeAppointments = myAppointments?.filter(app =>
        app.status === 'pending' || app.status === 'confirmed'
    ) || [];

    const pastAppointments = myAppointments?.filter(app =>
        app.status === 'completed' || app.status === 'cancelled'
    ) || [];

    /**
     * Data Logic: Notification Synthesis
     */
    useEffect(() => {
        const alerts = myAppointments?.filter(app => app.status !== 'pending').map(app => ({
            id: app.id,
            msg: `Your appointment with Dr. ${app.doctor?.user?.name} is now ${app.status}.`,
            status: app.status
        })) || [];
        setNotifications(alerts);
    }, [myAppointments]);

    /**
     * Initialization: Filter Pre-loading
     */
    useEffect(() => {
        if (filters?.doctor_id) {
            const targetDoctor = doctors.find(d => d.id == filters.doctor_id);
            if (targetDoctor) {
                setSelectedCategory(targetDoctor.specialization);
                setSearchTerm(targetDoctor.user.name);
            }
        }
    }, []);

    // --- Calendar Logic ---
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const getDaysInMonth = (year, month) => {
        const date = new Date(year, month, 1);
        const days = [];
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    };

    const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const padDays = Array(firstDayOfMonth).fill(null);

    /**
     * Helper: Doctor Availability Extractor
     */
    const getDoctorsOnDay = (dateObj) => {
        const dayName = weekDays[dateObj.getDay()];
        return filteredDoctors.filter(doc => doc.schedules.some(s => s.day === dayName));
    };

    /**
     * Helper: Day Availability Check
     */
    const isDayAvailable = (dateObj) => {
        if (!dateObj) return false;
        return getDoctorsOnDay(dateObj).length > 0;
    };

    /**
     * Core Engine: Multi-Factor Filtering
     */
    useEffect(() => {
        let results = doctors;

        if (selectedCategory) {
            results = results.filter(doc => doc.specialization === selectedCategory);
        }

        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            results = results.filter(doc =>
                doc.user.name.toLowerCase().includes(lowerTerm) ||
                doc.specialization.toLowerCase().includes(lowerTerm)
            );
        }

        if (selectedDate) {
            const selectedDayName = weekDays[selectedDate.getDay()];
            results = results.filter(doc => doc.schedules.some(s => s.day === selectedDayName));
        }

        setFilteredDoctors(results);
    }, [selectedCategory, searchTerm, selectedDate, doctors]);

    const handleTyping = (e) => { setSearchTerm(e.target.value); if(selectedDate) setSelectedDate(null); };

    const changeMonth = (offset) => {
        const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + offset));
        setCurrentDate(new Date(newDate));
        setSelectedDate(null);
    };

    /**
     * Interaction: Stage Booking
     */
    const handleBook = (scheduleId, doctorName, availableDays) => {
        const defaultDate = selectedDate ? selectedDate.toISOString().split('T')[0] : todayISO;
        setBookingModal({
            scheduleId,
            date: defaultDate,
            doctorName: doctorName,
            availableDays: availableDays
        });
    };

    /**
     * Interaction: Commit Booking
     */
    const confirmBooking = (e) => {
        e.preventDefault();
        if (bookingModal) {
            router.post(route('appointments.store'), {
                schedule_id: bookingModal.scheduleId,
                date: bookingModal.date
            }, {
                onSuccess: () => setBookingModal(null)
            });
        }
    };

    const initiateCancel = (id) => { setCancelModalId(id); };

    const confirmCancel = () => {
        if (cancelModalId) {
            router.patch(route('appointments.status', cancelModalId), { status: 'cancelled' }, {
                onSuccess: () => {
                    setCancelModalId(null);
                    triggerNotification("Consultation sequence terminated successfully.");
                }
            });
        }
    };

    const handleLogout = (e) => { e.preventDefault(); router.post(route('logout')); };

    return (
        <>
            <Head title="Health Portal | Patient Dashboard" />
            <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-teal-500/30">

                {alertMessage && (
                    <div className="fixed z-[100] top-24 left-1/2 -translate-x-1/2 animate-in slide-in-from-top-4">
                        <div className="flex items-center gap-3 px-6 py-3 font-black text-[10px] uppercase tracking-widest bg-teal-500 border border-teal-400 shadow-2xl text-slate-900 rounded-2xl">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                            {alertMessage}
                        </div>
                    </div>
                )}

                <nav className="fixed z-50 w-full border-b border-white/5 bg-slate-900/60 backdrop-blur-xl">
                    <div className="px-6 mx-auto max-w-7xl lg:px-8">
                        <div className="flex items-center justify-between h-20">
                            <Link href="/" className="flex items-center gap-3 group">
                                <div className="flex items-center justify-center w-10 h-10 transition-transform bg-teal-500 rounded-xl group-hover:rotate-6">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                                </div>
                                <span className="text-xl font-bold tracking-tighter text-white uppercase">MediFlow <span className="text-teal-500 text-[10px] font-black tracking-widest ml-1">Node</span></span>
                            </Link>

                            <div className="hidden p-1 space-x-1 border md:flex bg-black/20 rounded-2xl border-white/5">
                                <Link href="/" className="px-6 py-2 text-xs font-bold tracking-widest uppercase transition rounded-xl text-slate-400 hover:text-white">Home</Link>
                                <Link href={route('specialists')} className="px-6 py-2 text-xs font-bold tracking-widest uppercase transition rounded-xl text-slate-400 hover:text-white">Doctors</Link>
                                <a href="/#services" className="px-6 py-2 text-xs font-bold tracking-widest uppercase transition rounded-xl text-slate-400 hover:text-white">Services</a>
                                <Link href={route('contact')} className="px-6 py-2 text-xs font-bold tracking-widest uppercase transition rounded-xl text-slate-400 hover:text-white">Contact</Link>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <button onClick={() => setShowNotifDropdown(!showNotifDropdown)} className="relative p-2.5 transition border rounded-xl bg-white/[0.03] border-white/10 hover:bg-white/5 text-slate-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                                        {notifications.length > 0 && <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-[8px] font-black bg-teal-500 text-slate-900 rounded-full">{notifications.length}</span>}
                                    </button>
                                    {showNotifDropdown && (
                                        <div className="absolute right-0 mt-4 overflow-hidden border shadow-2xl w-72 bg-slate-900 border-white/10 rounded-2xl animate-in fade-in slide-in-from-top-2">
                                            <div className="p-4 text-[10px] font-black uppercase tracking-widest border-b bg-white/[0.02] border-white/5 text-slate-500 italic">System Alerts</div>
                                            <div className="overflow-y-auto max-h-64">
                                                {notifications.length > 0 ? notifications.map(n => (
                                                    <div key={n.id} className="p-4 text-[11px] font-medium border-b border-white/5 hover:bg-white/[0.02] transition leading-relaxed">{n.msg}</div>
                                                )) : <div className="p-10 text-center text-slate-600 text-[10px] font-bold uppercase tracking-widest italic">Buffer Empty</div>}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 px-4 py-2 border bg-slate-800/40 rounded-xl border-white/5">
                                    <div className="flex items-center justify-center w-8 h-8 text-xs font-black bg-teal-500 rounded-lg text-slate-900">{auth.user.name.charAt(0).toUpperCase()}</div>
                                    <p className="hidden text-xs italic font-bold tracking-widest text-white uppercase sm:block">{auth.user.name}</p>
                                </div>
                                <button onClick={handleLogout} className="p-2.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500 hover:text-white transition-all">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                <main className="px-6 pt-40 pb-20 mx-auto max-w-7xl lg:px-8">

                    {/* --- 1. SEARCH BAR --- */}
                    <div className="flex justify-center mb-16">
                        <div className="relative w-full max-w-3xl">
                            <input type="text" placeholder={selectedCategory ? `Filter ${selectedCategory} Specialists...` : "Identify Practitioner or Clinical Field..."} className="w-full h-16 px-16 text-sm font-medium text-white transition-all border outline-none bg-white/[0.02] border-white/10 rounded-[2rem] focus:ring-2 focus:ring-teal-500 backdrop-blur-xl" value={searchTerm} onChange={handleTyping} />
                            <div className="absolute -translate-y-1/2 left-6 top-1/2 text-slate-500">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                            </div>
                        </div>
                    </div>

                    {/* --- 2. DOCTOR DISCOVERY & CALENDAR (Moved Up) --- */}
                    <div className="grid grid-cols-1 gap-12 mb-20 lg:grid-cols-4">
                        <div className="space-y-10 lg:col-span-1">
                            {/* Specialties */}
                            <div className="p-8 border bg-white/[0.02] border-white/5 rounded-[2.5rem] shadow-2xl backdrop-blur-md">
                                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-500 mb-8 flex items-center gap-3">
                                    <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                                    Specialties
                                </h3>
                                <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                    {specialties?.map((cat, idx) => (
                                        <button key={idx} onClick={() => { setSelectedCategory(cat === selectedCategory ? null : cat); setSelectedDate(null); }} className={`w-full text-left px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-teal-500 text-slate-900 shadow-xl' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>{cat}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Calendar Widget */}
                            <div className={`p-8 border bg-white/[0.02] border-white/5 rounded-[2.5rem] shadow-2xl backdrop-blur-md transition-all ${!selectedCategory && !searchTerm ? 'opacity-20 grayscale pointer-events-none' : 'opacity-100'}`}>
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-[11px] font-black uppercase tracking-widest text-white italic">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                                    <div className="flex gap-4">
                                        <button onClick={() => changeMonth(-1)} className="text-slate-500 hover:text-teal-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M15 19l-7-7 7-7"/></svg></button>
                                        <button onClick={() => changeMonth(1)} className="text-slate-500 hover:text-teal-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M9 5l7 7-7 7"/></svg></button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-7 gap-2">
                                    {padDays.map((_, i) => <div key={i} />)}
                                    {daysInMonth.map((dayObj, i) => {
                                        const isAvailable = isDayAvailable(dayObj);
                                        const isSelected = selectedDate && dayObj.toDateString() === selectedDate.toDateString();
                                        return (
                                            <button
                                                key={i}
                                                disabled={!isAvailable}
                                                onClick={() => setSelectedDate(isSelected ? null : dayObj)}
                                                className={`h-10 w-full rounded-xl flex items-center justify-center text-[10px] font-black transition-all relative group
                                                    ${isSelected ? 'bg-teal-500 text-slate-900 shadow-lg shadow-teal-500/20' :
                                                      isAvailable ? 'bg-teal-500/10 text-teal-400 hover:bg-teal-500 hover:text-slate-900 ring-1 ring-teal-500/20' :
                                                      'text-slate-700 opacity-50'}`}
                                            >
                                                {dayObj.getDate()}
                                                {/* Visual Dot for Availability */}
                                                {isAvailable && !isSelected && (
                                                    <span className="absolute bottom-1.5 w-1 h-1 bg-teal-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(20,184,166,0.6)]"></span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Practitioners */}
                        <div className="lg:col-span-3">
                            {!selectedCategory && !searchTerm ? (
                                <div className="p-20 text-center border-2 border-dashed border-white/5 bg-white/[0.01] rounded-[3rem] min-h-[500px] flex flex-col justify-center">
                                    <svg className="w-16 h-16 mx-auto mb-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                                    <h2 className="mb-2 text-2xl italic font-black tracking-tight text-white">Practitioner Discovery</h2>
                                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-600">Select a discipline to initialize database search</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                    {filteredDoctors.map(doctor => (
                                        <div key={doctor.id} className="p-8 transition-all border bg-white/[0.02] border-white/5 rounded-[2.5rem] hover:bg-white/[0.04] group hover:border-teal-500/20">
                                            <div className="flex flex-col items-center mb-8 text-center">
                                                <div className="relative mb-6">
                                                    {doctor.image ?
                                                        <img src={`/storage/${doctor.image}`} className="w-24 h-24 rounded-[2rem] object-cover shadow-2xl border-2 border-white/10" alt="Specialist" /> :
                                                        <div className="w-24 h-24 rounded-[2rem] bg-slate-800 border-2 border-white/5 flex items-center justify-center font-black text-xl text-slate-500 italic uppercase">DR</div>
                                                    }
                                                    <div className="absolute flex items-center justify-center w-8 h-8 bg-teal-500 border-4 -bottom-2 -right-2 rounded-xl border-slate-900"><svg className="w-3.5 h-3.5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4"><path d="M5 13l4 4L19 7"/></svg></div>
                                                </div>
                                                <h3 className="text-lg italic font-black tracking-tight text-white uppercase">Dr. {doctor.user?.name}</h3>
                                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-teal-500 mt-1">{doctor.specialization}</p>
                                            </div>
                                            <div className="p-4 mb-8 space-y-3 border rounded-[1.5rem] bg-black/30 border-white/5">
                                                {doctor.schedules.length > 0 ? doctor.schedules.filter(s => !selectedDate || s.day === weekDays[selectedDate.getDay()]).map(schedule => (
                                                    <div key={schedule.id} className="flex items-center justify-between">
                                                        <div className="leading-tight text-left">
                                                            <span className="text-[10px] font-black text-white uppercase tracking-tighter block mb-0.5">{schedule.day}</span>
                                                            <span className="text-[9px] font-bold text-slate-600 uppercase truncate block max-w-[120px]">{schedule.hospital?.name}</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const availableDays = [...new Set(doctor.schedules.map(s => s.day))].join(', ');
                                                                handleBook(schedule.id, doctor.user.name, availableDays);
                                                            }}
                                                            className="h-8 px-4 bg-teal-500/10 text-teal-500 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-teal-500 hover:text-slate-900 transition-all"
                                                        >
                                                            {schedule.start_time}
                                                        </button>
                                                    </div>
                                                )) : <p className="text-[10px] font-bold uppercase tracking-widest text-slate-700 italic text-center py-2">No Active Slots</p>}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const validSchedule = doctor.schedules.find(s => !selectedDate || s.day === weekDays[selectedDate.getDay()]);
                                                    if (validSchedule) {
                                                        const availableDays = [...new Set(doctor.schedules.map(s => s.day))].join(', ');
                                                        handleBook(validSchedule.id, doctor.user.name, availableDays);
                                                    } else {
                                                        triggerNotification("Scheduling Conflict: No available slots matching your selection criteria.");
                                                    }
                                                }}
                                                className="w-full h-14 bg-teal-500 text-slate-900 rounded-[1.25rem] font-bold text-[10px] uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(20,184,166,0.4)] hover:bg-teal-400 transition-all active:scale-95 flex items-center justify-center gap-3"
                                            >
                                                ESTABLISH LINK
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- 3. ACTIVE CONSULTATIONS (Moved Down) --- */}
                    <div className="pt-10 mb-20 border-t border-white/5">
                        <div className="flex items-center gap-3 mb-10">
                            <h2 className="text-3xl italic font-black tracking-tight text-white uppercase">Active Consultations</h2>
                            <span className="h-[2px] flex-1 bg-white/5"></span>
                        </div>
                        {activeAppointments.length > 0 ? (
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {activeAppointments.map(app => {
                                    const isToday = app.date === todayISO;
                                    return (
                                        <div key={app.id} className={`relative p-8 border bg-white/[0.02] backdrop-blur-md rounded-[2.5rem] transition-all duration-500 border-white/5 ${isToday ? 'ring-2 ring-teal-500/50 shadow-2xl' : ''}`}>
                                            {isToday && <span className="absolute -top-4 right-8 px-4 py-1.5 bg-teal-500 text-slate-900 text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg italic animate-pulse">Critical Today</span>}
                                            <div className="flex items-start justify-between mb-8">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Practitioner Identity</p>
                                                    <p className="text-xl italic font-black tracking-tight text-white uppercase">Dr. {app.doctor?.user?.name}</p>
                                                </div>
                                                <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${app.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>{app.status}</span>
                                            </div>
                                            <div className="mb-10 space-y-4">
                                                <a href={`http://maps.google.com/?q=${encodeURIComponent(app.schedule?.hospital?.name)}`} target="_blank" className="flex items-center gap-3 transition-all group">
                                                    <div className="flex items-center justify-center w-8 h-8 transition-colors rounded-lg bg-teal-500/10 group-hover:bg-teal-500">
                                                        <svg className="w-4 h-4 text-teal-500 group-hover:text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                                    </div>
                                                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-white border-b border-transparent group-hover:border-teal-500">{app.schedule?.hospital?.name}</span>
                                                </a>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5">
                                                        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                                    </div>
                                                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-300">{app.date} • {app.schedule?.start_time}</span>
                                                </div>
                                            </div>
                                            <button onClick={() => initiateCancel(app.id)} className="w-full py-4 text-[9px] font-black uppercase tracking-[0.2em] text-red-500/50 hover:text-red-400 hover:bg-red-500/10 transition-all border border-red-500/5 rounded-2xl group flex items-center justify-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
                                                Terminate Request
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="p-20 text-center border-2 border-dashed border-white/5 bg-white/[0.01] rounded-[3rem]">
                                <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-600 italic">No Active Consultation Sequences</p>
                            </div>
                        )}
                    </div>

                    {/* --- 4. CLINICAL HISTORY (Bottom) --- */}
                    <div className="pt-24 mt-24 border-t border-white/5">
                        <button onClick={() => document.getElementById('history-section').classList.toggle('hidden')} className="flex items-center w-full gap-4 mb-8 transition-all group">
                            <div className="flex items-center justify-center w-12 h-12 rounded-[1.25rem] bg-white/5 border border-white/10 group-hover:bg-white/10">
                                <svg className="w-5 h-5 text-slate-400 group-hover:text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            </div>
                            <div className="text-left">
                                <h2 className="text-xl font-black tracking-widest uppercase text-slate-400 group-hover:text-white">Clinical History Repository</h2>
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">{pastAppointments.length} Archived Logs</span>
                            </div>
                            <div className="ml-auto">
                                <svg className="w-5 h-5 text-slate-500 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                            </div>
                        </button>
                        <div id="history-section" className="grid hidden grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-top-4">
                            {pastAppointments.map(app => (
                                <div key={app.id} className="p-6 transition-all border bg-white/[0.01] border-white/5 rounded-3xl hover:bg-white/[0.04]">
                                    <div className="flex items-start justify-between mb-4">
                                        <p className="text-xs italic font-black text-white uppercase">Dr. {app.doctor?.user?.name}</p>
                                        <span className={`text-[8px] px-2.5 py-1 rounded-lg font-black uppercase tracking-[0.2em] ${app.status === 'completed' ? 'text-teal-400 bg-teal-400/10' : 'text-red-400 bg-red-400/10'}`}>{app.status}</span>
                                    </div>
                                    <p className="text-[10px] font-mono text-slate-600 mb-6 uppercase">{app.date}</p>
                                    <div className="flex flex-col gap-3">
                                        <a href={`http://maps.google.com/?q=${encodeURIComponent(app.schedule?.hospital?.name)}`} target="_blank" className="flex items-center gap-2 text-[9px] font-bold text-slate-500 uppercase tracking-tighter hover:text-teal-500 transition-colors">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                                            {app.schedule?.hospital?.name}
                                        </a>
                                        {app.status === 'completed' && (
                                            <a href={route('appointments.receipt', app.id)} target="_blank" className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-teal-500 hover:text-slate-900 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                                                Archive Receipt
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>

                {/* --- BOOKING CONFIRMATION MODAL --- */}
                {bookingModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in zoom-in-95">
                        <div className="w-full max-w-lg p-12 border bg-slate-900 border-white/10 rounded-[3rem] shadow-2xl relative overflow-hidden">

                            {/* Decorative Glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[80px] -z-10"></div>

                            <h3 className="mb-2 text-2xl italic font-black text-white">Authorize Appointment</h3>
                            <p className="mb-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Initiating sequence for Dr. {bookingModal.doctorName}</p>

                            {/* ✅ VISUAL DISPLAY OF AVAILABLE DAYS */}
                            <div className="mb-8 p-6 rounded-3xl bg-white/[0.03] border border-white/5">
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-teal-500 mb-2">Operational Windows</p>
                                <p className="text-sm font-bold leading-relaxed text-white">{bookingModal.availableDays || "No Schedule Available"}</p>
                            </div>

                            <form onSubmit={confirmBooking} className="space-y-8">
                                <div>
                                    <label className="block mb-3 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Selected Clinical Date</label>
                                    {/* ✅ UPDATED DATE INPUT STYLE: Explicit inline styles force Dark Mode */}
                                    <input
                                        type="date"
                                        required
                                        className="w-full h-16 px-6 text-lg font-bold !text-white !bg-slate-950 border-2 border-teal-500/50 rounded-2xl focus:ring-0 focus:border-teal-400 focus:shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all outline-none appearance-none"
                                        style={{ backgroundColor: '#020617', color: 'white', colorScheme: 'dark' }}
                                        value={bookingModal.date}
                                        onChange={(e) => setBookingModal({...bookingModal, date: e.target.value})}
                                        min={todayISO}
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        className="flex-1 h-16 bg-teal-500 text-slate-900 rounded-[1.25rem] font-bold text-xs uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(20,184,166,0.4)] hover:bg-teal-400 hover:scale-[1.02] active:scale-95 transition-all"
                                    >
                                        CONFIRM ALLOCATION
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setBookingModal(null)}
                                        className="flex-1 h-16 bg-slate-800 text-slate-400 border border-white/10 rounded-[1.25rem] font-bold text-xs uppercase tracking-[0.2em] hover:bg-slate-700 hover:text-white active:scale-95 transition-all"
                                    >
                                        ABORT
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* --- TERMINATION CONFIRMATION MODAL --- */}
                {cancelModalId && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in zoom-in-95">
                        <div className="w-full max-w-md p-10 border border-red-500/20 bg-slate-900 rounded-[3rem] shadow-2xl relative">
                            <div className="absolute top-0 left-0 w-full h-full bg-red-500/5 blur-[80px] -z-10"></div>
                            <h3 className="mb-4 text-2xl italic font-black text-white">Abort Consultation?</h3>
                            <p className="mb-8 text-xs font-medium leading-relaxed text-slate-400">
                                This action is irreversible. The appointment slot will be released immediately.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={confirmCancel}
                                    className="flex-1 h-14 font-bold uppercase tracking-[0.2em] text-[11px] bg-red-500 text-white rounded-[1.25rem] shadow-xl hover:bg-red-400 active:scale-95 transition-all"
                                >
                                    CONFIRM ABORT
                                </button>
                                <button
                                    onClick={() => setCancelModalId(null)}
                                    className="flex-1 h-14 font-bold uppercase tracking-[0.2em] text-[11px] bg-white/[0.03] border border-white/5 text-slate-400 rounded-[1.25rem] hover:bg-white/10 active:scale-95 transition-all"
                                >
                                    RETURN
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </>
    );
}
