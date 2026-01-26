import { Link, Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function PatientDashboard({ auth, doctors, filters, specialties }) {

    // --- STATE ---
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [filteredDoctors, setFilteredDoctors] = useState([]); 

    // --- CALENDAR HELPERS ---
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
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const padDays = Array(firstDayOfMonth).fill(null);

    // --- AVAILABILITY CHECKER ---
    const isDayAvailable = (dateObj) => {
        if (!dateObj) return false;
        // If searching globally (no category), check availability for ALL matches
        if (!selectedCategory && !searchTerm) return false;

        const dayName = weekDays[dateObj.getDay()];
        
        // Check availability against the CURRENT filtered list
        return filteredDoctors.some(doc => 
            doc.schedules.some(s => s.day === dayName)
        );
    };

    // --- MASTER FILTER LOGIC ---
    useEffect(() => {
        let results = doctors;

        // 1. Filter by Category (Optional now)
        if (selectedCategory) {
            results = results.filter(doc => doc.specialization === selectedCategory);
        }

        // 2. Filter by Search (Global if no category, scoped if category exists)
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            results = results.filter(doc => 
                doc.user.name.toLowerCase().includes(lowerTerm) || 
                doc.specialization.toLowerCase().includes(lowerTerm)
            );
        }

        // 3. Filter by Date
        if (selectedDate) {
            const selectedDayName = weekDays[selectedDate.getDay()];
            results = results.filter(doc => 
                doc.schedules.some(s => s.day === selectedDayName)
            );
        }

        setFilteredDoctors(results);
    }, [selectedCategory, searchTerm, selectedDate, doctors]);

    // --- HANDLERS ---
    const handleTyping = (e) => {
        setSearchTerm(e.target.value);
        if(selectedDate) setSelectedDate(null);
    };
    
    const changeMonth = (offset) => {
        const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + offset));
        setCurrentDate(new Date(newDate));
        setSelectedDate(null);
    };

    const handleBook = (scheduleId) => {
        const defaultDate = selectedDate 
            ? selectedDate.toISOString().split('T')[0] 
            : new Date().toISOString().split('T')[0];

        const date = prompt("Confirm appointment date (YYYY-MM-DD):", defaultDate);
        if (date) {
            router.post(route('appointments.store'), { schedule_id: scheduleId, date: date }, {
                onSuccess: () => alert('Appointment Booked Successfully!'),
                onError: (errors) => alert('Error: ' + (errors.date || 'Could not book.'))
            });
        }
    };

    const handleLogout = (e) => { e.preventDefault(); router.post(route('logout')); };

    return (
        <>
            <Head title="Find a Doctor" />
            <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-teal-500 selection:text-white">
                
                {/* --- NAV BAR --- */}
                <nav className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-20 items-center">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center transform rotate-3">
                                    <span className="text-white font-bold text-xl">+</span>
                                </div>
                                <span className="text-2xl font-bold tracking-tight text-white">Medi<span className="text-teal-400">Flow</span></span>
                            </Link>
                            
                            {/* ✅ ADDED CONTACT TAB HERE */}
                            <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-300">
                                <Link href="/" className="hover:text-teal-400 transition">Home</Link>
                                <a href="/#services" className="hover:text-teal-400 transition">Services</a>
                                <Link href={route('contact')} className="hover:text-teal-400 transition">Contact</Link>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3 bg-slate-800/50 py-1.5 px-3 rounded-full border border-white/10">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                        {auth.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="text-left hidden sm:block pr-2">
                                        <p className="text-[10px] uppercase tracking-wider text-slate-400 leading-none mb-0.5">Patient</p>
                                        <p className="text-sm font-bold text-white leading-none">{auth.user.name}</p>
                                    </div>
                                </div>
                                <form onSubmit={handleLogout}>
                                    <button className="p-2 bg-slate-800 border border-white/10 text-slate-300 rounded-full hover:bg-red-500/10 hover:text-red-400 transition">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        
                        {/* --- LEFT COL: FILTERS --- */}
                        <div className="lg:col-span-1 space-y-8">
                            
                            {/* Categories */}
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><span>🩺</span> Specialties</h3>
                                <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {specialties && specialties.length > 0 ? (
                                        specialties.map((cat, idx) => (
                                            <button key={idx} onClick={() => { setSelectedCategory(cat === selectedCategory ? null : cat); setSelectedDate(null); }} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition flex justify-between items-center ${selectedCategory === cat ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}>
                                                {cat}
                                                {selectedCategory === cat && <span>✓</span>}
                                            </button>
                                        ))
                                    ) : ( <p className="text-xs text-slate-500 italic">No specialties found.</p> )}
                                </div>
                            </div>

                            {/* Calendar */}
                            <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl transition-opacity ${!selectedCategory && !searchTerm ? 'opacity-50 pointer-events-none grayscale' : 'opacity-100'}`}>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-white">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                                    <div className="flex gap-2">
                                        <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white transition">◀</button>
                                        <button onClick={() => changeMonth(1)} className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white transition">▶</button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-7 text-center mb-2">{['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <span key={d} className="text-xs font-bold text-slate-500 uppercase">{d}</span>)}</div>
                                <div className="grid grid-cols-7 gap-2">
                                    {padDays.map((_, i) => <div key={`pad-${i}`} />)}
                                    {daysInMonth.map((dayObj, i) => {
                                        const isAvailable = isDayAvailable(dayObj);
                                        const isSelected = selectedDate && dayObj.toDateString() === selectedDate.toDateString();
                                        return (
                                            <button key={i} disabled={!isAvailable} onClick={() => setSelectedDate(isSelected ? null : dayObj)} className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold transition relative mx-auto ${isSelected ? 'bg-teal-500 text-slate-900 shadow-lg scale-110' : ''} ${!isSelected && isAvailable ? 'bg-white/10 text-white hover:bg-white/20' : ''} ${!isSelected && !isAvailable ? 'text-slate-600 cursor-not-allowed' : ''}`}>
                                                {dayObj.getDate()}
                                                {!isSelected && isAvailable && <span className="absolute -bottom-1 w-1 h-1 bg-green-500 rounded-full"></span>}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* --- RIGHT COL: RESULTS --- */}
                        <div className="lg:col-span-3">
                            
                            {/* SEARCH BAR */}
                            <div className="mb-8 animate-in fade-in slide-in-from-top-4">
                                <div className="relative group max-w-xl">
                                    <div className="absolute inset-0 bg-teal-500/20 rounded-full blur-xl group-hover:bg-teal-500/30 transition"></div>
                                    <input 
                                        type="text" 
                                        placeholder={selectedCategory ? `Search ${selectedCategory}s by Name...` : "Search all doctors by Name..."} 
                                        className="relative w-full bg-white/5 border border-white/10 text-white rounded-full py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-teal-500 outline-none transition backdrop-blur-md shadow-2xl placeholder-slate-500"
                                        value={searchTerm}
                                        onChange={handleTyping}
                                    />
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                    </div>
                                </div>
                            </div>

                            {/* DOCTOR GRID */}
                            {!selectedCategory && !searchTerm ? (
                                <div className="h-full flex flex-col items-center justify-center bg-white/5 border border-white/5 border-dashed rounded-3xl p-12 text-center min-h-[400px]">
                                    <div className="text-6xl mb-6 opacity-30 animate-pulse">👈</div>
                                    <h2 className="text-3xl font-bold text-white mb-2">Select a Specialty or Search</h2>
                                    <p className="text-slate-400 max-w-md">Choose a medical category from the left menu OR type a doctor's name above to get started.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                                    {filteredDoctors.map(doctor => (
                                        <div key={doctor.id} className="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-teal-500/30 transition duration-300 group shadow-lg flex flex-col items-center text-center">
                                            
                                            <div className="relative mb-4">
                                                {doctor.image ? (<img src={`/storage/${doctor.image}`} alt="Doctor" className="h-24 w-24 rounded-full object-cover border-4 border-slate-800 shadow-xl" />) : (<div className="h-24 w-24 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 font-bold text-2xl border-4 border-slate-700">DR</div>)}
                                                <div className={`absolute bottom-1 right-1 w-5 h-5 border-4 border-slate-900 rounded-full ${doctor.schedules.length > 0 ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                                            </div>

                                            <h3 className="text-xl font-bold text-white mb-1">{doctor.user.name}</h3>
                                            <span className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-4">{doctor.specialization}</span>
                                            
                                            {/* Schedule Box */}
                                            <div className="w-full bg-slate-950/30 rounded-xl p-3 mb-4 text-sm text-slate-300 space-y-2 border border-white/5 min-h-[100px] flex flex-col justify-center">
                                                {doctor.schedules.length > 0 ? (
                                                    doctor.schedules
                                                    .filter(s => !selectedDate || s.day === weekDays[selectedDate.getDay()])
                                                    .map(schedule => (
                                                        <div key={schedule.id} className="flex justify-between border-b border-white/5 last:border-0 pb-1 last:pb-0">
                                                            <span className="text-white font-medium">{schedule.day}</span>
                                                            <div className="text-right">
                                                                <span className="text-teal-400 font-bold block">{schedule.start_time} - {schedule.end_time}</span>
                                                                <span className="text-[10px] text-slate-500 block truncate max-w-[80px]">{schedule.hospital.name}</span>
                                                            </div>
                                                            <button onClick={() => handleBook(schedule.id)} className="hidden"></button>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-xs text-slate-500 italic">No schedules added yet.</p>
                                                )}
                                                {selectedDate && doctor.schedules.length > 0 && !doctor.schedules.some(s => s.day === weekDays[selectedDate.getDay()]) && (
                                                    <p className="text-xs text-red-400">Not available on {weekDays[selectedDate.getDay()]}</p>
                                                )}
                                            </div>

                                            {doctor.schedules.length > 0 ? (
                                                <button 
                                                    onClick={() => {
                                                        const validSchedule = doctor.schedules.find(s => !selectedDate || s.day === weekDays[selectedDate.getDay()]);
                                                        if (validSchedule) handleBook(validSchedule.id);
                                                        else alert("This doctor is not available on the selected date.");
                                                    }}
                                                    className="w-full py-2.5 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg font-bold hover:shadow-lg hover:shadow-teal-500/20 active:scale-95 transition"
                                                >
                                                    Book {selectedDate ? selectedDate.toLocaleDateString() : 'Appointment'}
                                                </button>
                                            ) : (
                                                <button disabled className="w-full py-2.5 bg-slate-800 text-slate-500 rounded-lg font-bold cursor-not-allowed border border-white/5">
                                                    Unavailable
                                                </button>
                                            )}
                                        </div>
                                    ))}

                                    {filteredDoctors.length === 0 && (
                                        <div className="col-span-full text-center py-20">
                                            <p className="text-slate-500 text-lg">No doctors found matching "{searchTerm}".</p>
                                            <button onClick={() => {setSelectedDate(null); setSearchTerm('')}} className="text-teal-400 underline mt-2">Reset Filters</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}