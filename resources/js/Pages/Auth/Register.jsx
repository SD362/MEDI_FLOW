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
            <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden font-sans text-white bg-slate-900 selection:bg-teal-500 selection:text-white">

                {/* Background Glow Effects */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-[120px] -z-10"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10"></div>

                {/* --- LOGO SECTION --- */}
                <div className="mb-8 text-center">
                    <Link href="/" className="flex items-center justify-center gap-2 mb-2">
                        <div className="flex items-center justify-center w-10 h-10 transform bg-teal-500 shadow-lg rounded-xl rotate-3">
                            <span className="text-2xl font-bold text-white">+</span>
                        </div>
                        <span className="text-3xl font-bold tracking-tight text-white">
                            Medi<span className="text-teal-400">Flow</span>
                        </span>
                    </Link>
                    <p className="text-slate-400">Join us to manage your health better.</p>
                </div>

                {/* --- GLASSMORPHISM CARD --- */}
                <div className="w-full max-w-md p-8 border shadow-2xl bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl">

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
                                className="w-full px-4 py-3 text-white transition border shadow-inner outline-none bg-slate-950/50 border-white/10 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-slate-500"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                placeholder="John Doe"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
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
                                className="w-full px-4 py-3 text-white transition border shadow-inner outline-none bg-slate-950/50 border-white/10 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-slate-500"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                placeholder="name@example.com"
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
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
                                className="w-full px-4 py-3 text-white transition border shadow-inner outline-none bg-slate-950/50 border-white/10 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-slate-500"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
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
                                className="w-full px-4 py-3 text-white transition border shadow-inner outline-none bg-slate-950/50 border-white/10 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-slate-500"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                            {errors.password_confirmation && <p className="mt-1 text-sm text-red-400">{errors.password_confirmation}</p>}
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
                        <div className="mt-6 text-sm text-center text-slate-400">
                            Already have an account?{' '}
                            <Link
                                href={route('login')}
                                className="font-semibold text-teal-400 transition hover:text-teal-300"
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
