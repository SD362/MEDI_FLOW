import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome to MediFlow" />
            
            {/* Main Background - Deep Navy */}
            <div className="min-h-screen bg-slate-900 text-white selection:bg-teal-500 selection:text-white font-sans">
                
                {/* --- TOP NAVIGATION --- */}
                <nav className="fixed w-full z-50 transition-all duration-300 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-20 items-center">
                            
                            {/* Logo */}
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center transform rotate-3">
                                    <span className="text-white font-bold text-xl">+</span>
                                </div>
                                <span className="text-2xl font-bold tracking-tight text-white">
                                    Medi<span className="text-teal-400">Flow</span>
                                </span>
                            </div>

                            {/* Center Links (Hidden on mobile) */}
                            <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-300">
                                <Link href="/" className="hover:text-teal-400 transition">Home</Link>
                                
                                {/* ✅ UPDATED: Links to the Public Specialists Directory */}
                                <Link href={route('specialists')} className="hover:text-teal-400 transition">
                                    Doctors
                                </Link>
                                
                                <a href="#services" className="hover:text-teal-400 transition">Services</a>
                                
                                {/* ✅ UPDATED: Links to the Contact Map Page */}
                                <Link href={route('contact')} className="hover:text-teal-400 transition">Contact</Link>
                            </div>

                            {/* Right Actions */}
                            <div className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="text-slate-300 hover:text-white font-medium"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="text-slate-300 hover:text-white font-medium transition"
                                        >
                                            Log in
                                        </Link>

                                        <Link
                                            href={route('register')}
                                            className="px-6 py-2.5 bg-teal-500 text-slate-900 rounded-full font-bold hover:bg-teal-400 transition shadow-[0_0_20px_rgba(20,184,166,0.3)]"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* --- HERO SECTION --- */}
                <div id="home" className="pt-32 pb-20 relative overflow-hidden">
                    {/* Background Glow Effects */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-[120px] -z-10"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] -z-10"></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
                        
                        {/* Left: Content */}
                        <div className="w-full md:w-1/2 text-center md:text-left z-10">
                            <div className="inline-block px-4 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-300 text-sm font-semibold mb-6">
                                🏥 #1 Trusted Healthcare Platform
                            </div>
                            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
                                Your Health, <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                                    Our Priority.
                                </span>
                            </h1>
                            <p className="text-lg text-slate-400 mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
                                Experience the future of healthcare. Book appointments with top specialists, manage records, and consult online—all in one secure place.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <Link
                                    href={route('register')}
                                    className="px-8 py-4 bg-teal-500 text-slate-900 rounded-full font-bold text-lg hover:bg-teal-400 transition transform hover:-translate-y-1 shadow-lg"
                                >
                                    Book Appointment
                                </Link>
                                
                                {/* ✅ UPDATED: "View Specialists" Button now works */}
                                <Link 
                                    href={route('specialists')}
                                    className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-bold text-lg hover:bg-white/10 transition backdrop-blur-sm"
                                >
                                    View Specialists
                                </Link>
                            </div>
                        </div>

                        {/* Right: Graphic */}
                        <div className="w-full md:w-1/2 mt-12 md:mt-0 relative flex justify-center">
                            <div className="absolute w-[400px] h-[400px] border border-white/10 rounded-full animate-[spin_20s_linear_infinite]"></div>
                            <div className="relative w-80 h-96 md:w-[400px] md:h-[500px] bg-gradient-to-b from-slate-800 to-slate-900 rounded-[2rem] border border-white/10 shadow-2xl flex items-center justify-center overflow-hidden">
                                <div className="text-[150px] md:text-[200px] drop-shadow-2xl filter grayscale-[30%] hover:grayscale-0 transition duration-500">
                                    👨‍⚕️
                                </div>
                                <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex items-center gap-4">
                                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">✓</div>
                                    <div>
                                        <p className="text-sm text-slate-300">Available Doctors</p>
                                        <p className="font-bold text-white text-lg">120+ Specialists</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- FEATURES SECTION --- */}
                <div id="services" className="py-24 relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Streamlined Healthcare</h2>
                            <p className="text-slate-400">Everything you need to manage your well-being.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-teal-500/50 hover:bg-white/10 transition duration-300 group">
                                <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition">🗓️</div>
                                <h3 className="text-xl font-bold text-white mb-3">Instant Scheduling</h3>
                                <p className="text-slate-400 leading-relaxed">Book appointments in real-time. No waiting on hold, just click and confirm your slot.</p>
                            </div>
                            <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-teal-500/50 hover:bg-white/10 transition duration-300 group">
                                <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition">🔍</div>
                                <h3 className="text-xl font-bold text-white mb-3">Smart Search</h3>
                                <p className="text-slate-400 leading-relaxed">Filter by specialization, location, or doctor name to find exactly who you need.</p>
                            </div>
                            <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-teal-500/50 hover:bg-white/10 transition duration-300 group">
                                <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition">🛡️</div>
                                <h3 className="text-xl font-bold text-white mb-3">Data Security</h3>
                                <p className="text-slate-400 leading-relaxed">Enterprise-grade encryption keeps your medical records private and secure at all times.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="bg-slate-950 py-12 border-t border-white/10">
                    <div className="max-w-7xl mx-auto px-4 text-center">
                        <p className="text-slate-500 text-sm">&copy; 2026 MediFlow Inc. Designed with care.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}