import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function DoctorDashboard({ auth, hospitals }) { // <--- Receive 'hospitals' prop
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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Doctor Portal</h2>}
        >
            <Head title="Doctor Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Add Availability Form */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-4">Set Your Availability</h3>
                        
                        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            {/* Select Hospital */}
                            <div>
                                <label className="block text-sm font-medium">Select Hospital</label>
                                <select 
                                    className="w-full border-gray-300 rounded-md shadow-sm"
                                    value={data.hospital_id}
                                    onChange={(e) => setData('hospital_id', e.target.value)}
                                >
                                    <option value="">-- Choose Hospital --</option>
                                    {hospitals.map(hospital => (
                                        <option key={hospital.id} value={hospital.id}>
                                            {hospital.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.hospital_id && <div className="text-red-500 text-sm">{errors.hospital_id}</div>}
                            </div>

                            {/* Select Day */}
                            <div>
                                <label className="block text-sm font-medium">Day of Week</label>
                                <select 
                                    className="w-full border-gray-300 rounded-md shadow-sm"
                                    value={data.day}
                                    onChange={(e) => setData('day', e.target.value)}
                                >
                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                        <option key={day} value={day}>{day}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Start Time */}
                            <div>
                                <label className="block text-sm font-medium">Start Time</label>
                                <input 
                                    type="time" 
                                    className="w-full border-gray-300 rounded-md shadow-sm"
                                    value={data.start_time}
                                    onChange={(e) => setData('start_time', e.target.value)}
                                />
                                {errors.start_time && <div className="text-red-500 text-sm">{errors.start_time}</div>}
                            </div>

                            {/* End Time */}
                            <div>
                                <label className="block text-sm font-medium">End Time</label>
                                <input 
                                    type="time" 
                                    className="w-full border-gray-300 rounded-md shadow-sm"
                                    value={data.end_time}
                                    onChange={(e) => setData('end_time', e.target.value)}
                                />
                                {errors.end_time && <div className="text-red-500 text-sm">{errors.end_time}</div>}
                            </div>

                            <button 
                                type="submit" 
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 mt-4 md:col-span-2"
                                disabled={processing}
                            >
                                Add Schedule
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}