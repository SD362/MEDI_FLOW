import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>
            <Head title="Log in" />

            {/* ✅ Full Screen Navy Background */}
            <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans selection:bg-teal-500 selection:text-white">
                
                {/* Background Glow Effects */}
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-[120px] -z-10"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10"></div>

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
                    <p className="text-slate-400">Welcome back! Please enter your details.</p>
                </div>

                {/* --- GLASSMORPHISM CARD --- */}
                <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    
                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-400 bg-green-400/10 p-3 rounded-lg border border-green-400/20">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        
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
                                placeholder="doctor@mediflow.com"
                                autoFocus
                                onChange={(e) => setData('email', e.target.value)}
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
                                autoComplete="current-password"
                                placeholder="••••••••"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-white/20 bg-slate-800 text-teal-500 focus:ring-teal-500"
                                />
                                <span className="ml-2 text-sm text-slate-400">Remember me</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-teal-400 hover:text-teal-300 hover:underline transition"
                                >
                                    Forgot Password?
                                </Link>
                            )}
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-bold hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Signing In...' : 'Log in'}
                        </button>
                        
                        {/* Register Link */}
                        <div className="text-center text-sm text-slate-400 mt-6">
                            Don't have an account?{' '}
                            <Link href={route('register')} className="text-teal-400 font-semibold hover:text-teal-300 transition">
                                Sign up
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}