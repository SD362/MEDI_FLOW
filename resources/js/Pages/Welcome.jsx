import { Link, Head } from '@inertiajs/react';

/**
 * Welcome Component
 * Serves as the primary landing interface for the MediFlow health platform.
 * Dynamically renders system metrics and orchestrates public-to-private session transitions.
 */
export default function Welcome({ auth, doctorCount }) {
    return (
        <>
            <Head title="MediFlow | Intelligent Healthcare Management" />

            <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-teal-500/30">

                {/* --- NAVIGATION INTERFACE --- */}
                <nav className="fixed z-50 w-full border-b border-white/5 bg-slate-900/60 backdrop-blur-xl">
                    <div className="px-6 mx-auto max-w-7xl lg:px-8">
                        <div className="flex items-center justify-between h-20">

                            <div className="flex items-center gap-3 group">
                                <div className="flex items-center justify-center w-10 h-10 transition-transform bg-teal-500 shadow-lg rounded-xl group-hover:rotate-6 shadow-teal-500/20">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                    </svg>
                                </div>
                                <span className="text-xl font-bold tracking-tighter text-white">
                                    MediFlow <span className="text-teal-500 text-[10px] font-black tracking-[0.3em] ml-1 uppercase">Health</span>
                                </span>
                            </div>

                            <div className="hidden p-1 space-x-1 border md:flex bg-black/20 rounded-2xl border-white/5">
                                <Link href="/" className="px-6 py-2 text-xs font-bold tracking-widest text-teal-400 uppercase transition shadow-inner rounded-xl bg-white/5">Home</Link>
                                <Link href={route('specialists')} className="px-6 py-2 text-xs font-bold tracking-widest uppercase transition rounded-xl text-slate-400 hover:text-white">Doctors</Link>
                                <a href="#services" className="px-6 py-2 text-xs font-bold tracking-widest uppercase transition rounded-xl text-slate-400 hover:text-white">Services</a>
                                <Link href={route('contact')} className="px-6 py-2 text-xs font-bold tracking-widest uppercase transition rounded-xl text-slate-400 hover:text-white">Contact</Link>
                            </div>

                            <div className="flex items-center gap-4">
                                {auth.user ? (
                                    <Link href={route('dashboard')} className="px-6 py-2 text-xs font-black tracking-widest text-teal-500 uppercase transition-all border border-teal-500/20 rounded-xl hover:bg-teal-500/10">
                                        Terminal Access
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-6">
                                        <Link href={route('login')} className="text-xs font-bold tracking-widest uppercase transition text-slate-400 hover:text-white">Log in</Link>
                                        <Link href={route('register')} className="px-6 py-2.5 bg-white text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition shadow-xl active:scale-95">SIGN UP</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* --- HERO SECTION --- */}
                <div id="home" className="relative px-6 pt-48 pb-32 overflow-hidden">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[120px] -z-10"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10"></div>

                    <div className="flex flex-col items-center mx-auto max-w-7xl md:flex-row">
                        <div className="z-10 w-full text-center md:w-1/2 md:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-500/20 bg-teal-500/5 text-teal-400 text-[10px] font-black uppercase tracking-widest mb-8">
                                <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
                                Primary Health Infrastructure v2.0
                            </div>
                            <h1 className="mb-8 text-5xl font-black italic tracking-tighter text-white md:text-8xl leading-[0.9]">
                                Redefining <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-blue-400 to-teal-500">
                                    Clinical Flow.
                                </span>
                            </h1>
                            <p className="max-w-lg mx-auto mb-12 text-sm font-medium leading-relaxed tracking-widest uppercase text-slate-500 md:mx-0">
                                High-performance orchestration for medical consultations. Secure, digitized, and optimized for clinical precision.
                            </p>

                            <div className="flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
                                <Link href={route('register')} className="px-10 py-5 bg-teal-500 text-slate-900 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-teal-500/20 hover:bg-teal-400 transition-all hover:-translate-y-1 active:scale-95">
                                    Book an appointment
                                </Link>
                                <Link href={route('specialists')} className="px-10 py-5 border border-white/10 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-white/5 transition-all backdrop-blur-sm active:scale-95">
                                    Medical Network
                                </Link>
                            </div>
                        </div>

                        {/* VISUAL ASSET MODULE */}
                        <div className="relative flex justify-center w-full mt-24 md:w-1/2 md:mt-0">
                            <div className="absolute w-[450px] h-[450px] border border-white/5 rounded-full animate-[spin_30s_linear_infinite]"></div>
                            <div className="relative w-80 h-[450px] bg-white/[0.02] border border-white/5 rounded-[3rem] shadow-2xl flex items-center justify-center overflow-hidden backdrop-blur-3xl group">
                                <div className="text-[180px] filter grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition duration-1000">
                                    👨‍⚕️
                                </div>
                                <div className="absolute flex flex-col gap-1 p-6 border bottom-8 left-8 right-8 bg-slate-900/80 border-white/10 rounded-2xl backdrop-blur-md">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Validated Infrastructure</span>
                                    </div>
                                    <p className="text-2xl italic font-black tracking-tight text-white">
                                        {doctorCount || 0}<span className="text-teal-500">+</span> <span className="text-xs not-italic font-bold tracking-widest uppercase text-slate-500">Practitioners</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- SERVICE MODULES --- */}
                <div id="services" className="relative px-6 py-32">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-20 text-center">
                            <h2 className="mb-4 text-4xl italic font-black tracking-tight text-white">System Protocol</h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Core Operational Capabilities</p>
                        </div>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            {[
                                { title: 'Synchronized Scheduling', desc: 'Real-time resource allocation for clinical sessions. Zero-latency booking protocols.', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                                { title: 'Practitioner Discovery', desc: 'Advanced search algorithms for identifying medical specialists by discipline.', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
                                { title: 'End-to-End Encryption', desc: 'AES-256 standard security for patient records and data transmission.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' }
                            ].map((service, i) => (
                                <div key={i} className="p-10 transition-all border rounded-[2.5rem] bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-teal-500/20 group">
                                    <div className="flex items-center justify-center w-16 h-16 mb-8 transition-transform border bg-slate-900 border-white/5 rounded-2xl group-hover:scale-110">
                                        <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={service.icon}/></svg>
                                    </div>
                                    <h3 className="mb-4 text-xl italic font-black tracking-tight text-white">{service.title}</h3>
                                    <p className="text-sm font-medium leading-relaxed tracking-wide text-slate-500">{service.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <footer className="py-20 border-t bg-slate-950/50 border-white/5">
                    <div className="px-6 mx-auto text-center max-w-7xl">
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600 italic">
                            © 2026 MediFlow Infrastructure • Licensed Clinical Network
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
