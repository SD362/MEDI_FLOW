import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function PatientDashboard({ auth, schedules }) {
    const { data, setData, post, processing, reset } = useForm({
        schedule_id: '',
        date: '',
    });

    const handleBook = (scheduleId) => {
        // 1. Ask user for a date (simple implementation)
        const date = prompt("Enter appointment date (YYYY-MM-DD):", "2026-02-01");
        
        if (date) {
            // 2. Set data manually and submit
            // We can't use setData here easily because state is async, 
            // so we send the data directly in the post request options (or use a different form approach).
            // A simpler way for this level:
            
            post(route('appointments.store'), {
                data: { schedule_id: scheduleId, date: date },
                onSuccess: () => alert('Appointment Confirmed!'),
                onError: () => alert('Error booking appointment.'),
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Find a Doctor</h2>}
        >
            <Head title="Patient Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {schedules.map(schedule => (
                            <div key={schedule.id} className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-blue-500">
                                <h3 className="text-xl font-bold">{schedule.doctor.user.name}</h3>
                                <p className="text-gray-500">{schedule.doctor.specialization}</p>
                                
                                <div className="mt-4 text-sm">
                                    <p><strong>Hospital:</strong> {schedule.hospital.name}</p>
                                    <p><strong>Day:</strong> {schedule.day}</p>
                                    <p><strong>Time:</strong> {schedule.start_time} - {schedule.end_time}</p>
                                </div>

                                <button 
                                    onClick={() => handleBook(schedule.id)}
                                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                                >
                                    Book Now
                                </button>
                            </div>
                        ))}

                        {schedules.length === 0 && (
                            <p className="text-gray-500 col-span-3 text-center">No doctors available yet.</p>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}