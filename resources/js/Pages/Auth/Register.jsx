import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <>
            <Head title="Register" />

            {/* ✅ Full Screen Navy Background */}
            <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans selection:bg-teal-500 selection:text-white">
                
                {/* Background Glow Effects */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-[120px] -z-10"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10"></div>

                {/* --- LOGO SECTION --- */}
                <div className="mb-8 text-center">
                    <Link href="/" className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center transform rotate-3 shadow-lg">
                            <span className="text-white font-bold text-2xl">+</span>
                        </div>
                        <span className="text-3xl font-bold tracking-tight text-white">
                            Medi<span className="text-teal-400">Flow</span>
                        </span>
                    </Link>
                    <p className="text-slate-400">Join us to manage your health better.</p>
                </div>

                {/* --- GLASSMORPHISM CARD --- */}
                <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    
                    <form onSubmit={submit} className="space-y-5">
                        
                        {/* Name Input */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="name">
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                value={data.name}
                                className="w-full bg-slate-950/50 border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition placeholder-slate-500 shadow-inner"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                placeholder="John Doe"
                            />
                            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                        </div>

                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="w-full bg-slate-950/50 border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition placeholder-slate-500 shadow-inner"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                placeholder="name@example.com"
                            />
                            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="w-full bg-slate-950/50 border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition placeholder-slate-500 shadow-inner"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="password_confirmation">
                                Confirm Password
                            </label>
                            <input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="w-full bg-slate-950/50 border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition placeholder-slate-500 shadow-inner"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                            {errors.password_confirmation && <p className="text-red-400 text-sm mt-1">{errors.password_confirmation}</p>}
                        </div>

                        {/* Register Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-bold hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Creating Account...' : 'Register'}
                            </button>
                        </div>

                        {/* Already Registered Link */}
                        <div className="text-center text-sm text-slate-400 mt-6">
                            Already have an account?{' '}
                            <Link 
                                href={route('login')} 
                                className="text-teal-400 font-semibold hover:text-teal-300 transition"
                            >
                                Log in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}