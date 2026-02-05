import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import { Head, Link, useForm } from '@inertiajs/react';

/**
 * Login Component
 * Facilitates secure user authentication for the MediFlow platform.
 * Employs a glassmorphic design language with localized glow effects for a premium UI.
 */
export default function Login({ status, canResetPassword }) {

    /**
     * Form Hook Initialization
     * Synchronizes local input state with Inertia's processing engine.
     */
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    /**
     * Lifecycle Logic: Memory Management
     * Ensures sensitive data (password) is purged from local state upon component unmount.
     */
    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    /**
     * Action: Authentication Request
     * Logic: Dispatches a persistent POST request to the authentication endpoint.
     */
    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>
            <Head title="Portal Access | MediFlow" />

            <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans selection:bg-teal-500/30">

                {/* Ambience Layers: High-radius blur for depth */}
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[120px] -z-10"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10"></div>

                {/* --- BRANDING HEADER --- */}
                <div className="mb-10 text-center">
                    <Link href="/" className="flex items-center justify-center gap-3 mb-4 group">
                        <div className="flex items-center justify-center w-12 h-12 transition-transform bg-teal-500 shadow-xl rounded-2xl group-hover:rotate-6 shadow-teal-500/20">
                            <svg className="text-white w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                            </svg>
                        </div>
                        <span className="text-3xl italic font-black tracking-tighter text-white">
                            MediFlow <span className="text-teal-500 not-italic text-sm font-black tracking-[0.3em] ml-1 uppercase">Secure</span>
                        </span>
                    </Link>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Authorized Personnel Only</p>
                </div>

                {/* --- AUTHENTICATION MODULE --- */}
                <div className="w-full max-w-md bg-white/[0.02] backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in zoom-in-95 duration-500">

                    {status && (
                        <div className="mb-6 text-[10px] font-black uppercase tracking-widest text-teal-400 bg-teal-400/5 p-4 rounded-2xl border border-teal-400/20 flex items-center gap-3">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-8">

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1" htmlFor="email">
                                Identity Access Key
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 flex items-center pointer-events-none left-5 text-slate-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="w-full py-4 pr-6 text-white transition-all border outline-none bg-black/20 border-white/10 rounded-2xl pl-14 focus:ring-2 focus:ring-teal-500 placeholder:text-slate-700"
                                    autoComplete="username"
                                    placeholder="Enter registered email"
                                    autoFocus
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-2 ml-1">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1" htmlFor="password">
                                Security Cipher
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 flex items-center pointer-events-none left-5 text-slate-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="w-full py-4 pr-6 text-white transition-all border outline-none bg-black/20 border-white/10 rounded-2xl pl-14 focus:ring-2 focus:ring-teal-500 placeholder:text-slate-700"
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                            </div>
                            {errors.password && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-2 ml-1">{errors.password}</p>}
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center cursor-pointer group">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-5 h-5 text-teal-500 transition-all rounded-lg border-white/10 bg-black/40 focus:ring-offset-slate-900 focus:ring-teal-500"
                                />
                                <span className="ml-3 text-[11px] font-bold text-slate-500 group-hover:text-slate-300 transition-colors">Maintain Session</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-[11px] font-black uppercase tracking-widest text-teal-500/70 hover:text-teal-400 transition-colors"
                                >
                                    Recover Access
                                </Link>
                            )}
                        </div>

                        {/* UPDATED ACTION BUTTON: Matches uploaded image style */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full h-16 bg-teal-500 text-slate-900 rounded-[1.5rem] font-bold text-xs uppercase tracking-[0.3em] shadow-xl shadow-teal-500/10 hover:bg-teal-400 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-30 flex items-center justify-center gap-4"
                        >
                            {processing ? (
                                <svg className="w-5 h-5 animate-spin text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : (
                                <>
                                    LOG IN
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                </>
                            )}
                        </button>

                        <div className="pt-4 text-center">
                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                                New to the infrastructure?{' '}
                                <Link href={route('register')} className="ml-1 text-teal-500 transition-colors hover:text-teal-400">
                                    Register
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>

                <p className="mt-12 text-[9px] font-black uppercase tracking-[0.5em] text-slate-700">
                    © 2026 MediFlow Terminal • Secure Node 01
                </p>
            </div>
        </>
    );
}
