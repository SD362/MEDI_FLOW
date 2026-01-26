import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function AdminDashboard({ auth }) {
    // This hook handles the form data and submission
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        specialization: '',
        bio: '',
        image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('doctors.store'), {
            forceFormData: true,
            onSuccess: () => reset(), // Clear form after success
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Control Panel</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Welcome Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-bold">Welcome, Administrator!</h3>
                        <p className="text-gray-600">Use the form below to register new doctors into the system.</p>
                    </div>

                    {/* Add Doctor Form */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-4">Add a New Doctor</h3>
                        
                        <form onSubmit={submit} className="space-y-4 max-w-xl">
                            {/* Name */}
                            <div>
                                <label className="block font-medium text-sm text-gray-700">Doctor Name</label>
                                <input 
                                    type="text" 
                                    className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block font-medium text-sm text-gray-700">Email Address</label>
                                <input 
                                    type="email" 
                                    className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block font-medium text-sm text-gray-700">Password</label>
                                <input 
                                    type="password" 
                                    className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
                            </div>

                            {/* Specialization */}
                            <div>
                                <label className="block font-medium text-sm text-gray-700"> ialization (e.g., Dentist)</label>
                                <input 
                                    type="text" 
                                    className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full"
                                    value={data.specialization}
                                    onChange={(e) => setData('specialization', e.target.value)}
                                />
                                {errors.specialization && <div className="text-red-500 text-sm">{errors.specialization}</div>}
                            </div>
                            {/* Profile Image Input */}
                            <div>
                                <label className="block font-medium text-sm text-gray-700">Profile Photo</label>
                                <input 
                                    type="file" 
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    onChange={(e) => setData('image', e.target.files[0])} // <--- Grabs the file
                                />
                                {errors.image && <div className="text-red-500 text-sm">{errors.image}</div>}
                            </div>

                            {/* Submit Button */}
                            <button 
                                type="submit" 
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700" 
                                disabled={processing}
                            >
                                {processing ? 'Creating...' : 'Create Doctor Account'}
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}