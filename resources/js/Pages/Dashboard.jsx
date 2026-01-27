import { Head, Link } from '@inertiajs/react';

/**
 * Dashboard Component
 * Primary entry portal for authenticated sessions.
 * Provides systemic orientation and secure routing to role-specific administrative modules.
 */
export default function Dashboard({ auth }) {
    return (
        <>
            <Head title="System Access Portal" />

            <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-teal-500/30">

                {/* --- NAVIGATION INTERFACE --- */}
                <nav className="fixed z-50 w-full border-b border-white/5 bg-slate-900/60 backdrop-blur-xl">
                    <div className="px-6 mx-auto max-w-7xl lg:px-8">
                        <div className="flex items-center justify-between h-20">

                            <Link href="/" className="flex items-center gap-3 group">
                                <div className="flex items-center justify-center w-10 h-10 transition-transform bg-teal-500 rounded-xl group-hover:rotate-6">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                    </svg>
                                </div>
                                <span className="text-xl font-bold tracking-tighter text-white uppercase">
                                    MediFlow <span className="text-teal-500 text-[10px] font-black tracking-[0.3em] ml-1">Portal</span>
                                </span>
                            </Link>

                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 border border-white/10 px-3 py-1 rounded-full italic">
                                    Session: {auth.user.role}
                                </span>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* --- CENTRAL PORTAL CONTENT --- */}
                <main className="max-w-4xl px-6 pt-40 pb-20 mx-auto text-center">

                    {/* Access Verification Module */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-12 backdrop-blur-md shadow-2xl animate-in fade-in zoom-in-95 duration-700">
                        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-8 bg-teal-500/10 rounded-3xl">
                            <svg className="w-10 h-10 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                            </svg>
                        </div>

                        <h1 className="mb-4 text-3xl italic font-black tracking-tight text-white md:text-4xl">
                            Authentication Successful
                        </h1>

                        <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.2em] mb-10 leading-relaxed">
                            Welcome back, {auth.user.name}. Your secure session is now active.
                        </p>

                        <div className="grid grid-cols-1 gap-4">
                            {/**
                             * Action: Logic-Based Redirect
                             * Redirects the user to the unified dashboard which handles role-based rendering.
                             */}
                            <Link
                                href={route('dashboard')}
                                className="group flex items-center justify-center gap-3 h-16 bg-teal-500 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-teal-500/10 hover:bg-teal-400 transition-all active:scale-95"
                            >
                                Enter System Command
                                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                                </svg>
                            </Link>

                            <Link
                                href="/"
                                className="flex items-center justify-center h-16 border border-white/5 bg-white/[0.02] text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/[0.05] transition-all"
                            >
                                Return to Terminal
                            </Link>
                        </div>
                    </div>

                    {/* Security Disclaimer */}
                    <div className="flex items-center justify-center gap-2 mt-12 opacity-30">
                        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                        </svg>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                            Encrypted End-to-End Environment
                        </p>
                    </div>
                </main>

                <footer className="fixed bottom-0 w-full py-10 text-center">
                    <p className="text-slate-700 text-[9px] font-black uppercase tracking-[0.5em]">
                        © 2026 MediFlow Infrastructure • Secure Access Node
                    </p>
                </footer>
            </div>
        </>
    );
}
