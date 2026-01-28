import { Head, Link } from '@inertiajs/react';

/**
 * AppointmentReceipt Component
 * Generates a formal clinical record.
 * Includes options to Print physically or Download as PDF via browser native tools.
 */
export default function AppointmentReceipt({ appointment }) {

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <Head title={`Receipt #${appointment.id} - ${appointment.user.name}`} />

            <div className="min-h-screen p-6 font-sans text-slate-200 bg-[#0f172a] selection:bg-teal-500/30 md:p-12 lg:p-20 print:bg-white print:text-slate-950 print:p-0">

                {/* --- PRIMARY DOCUMENT CONTAINER --- */}
                <div id="receipt-content" className="max-w-4xl mx-auto bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden print:border-0 print:shadow-none print:bg-transparent">

                    {/* Gradient Ambience (Hidden on print/pdf) */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/5 blur-[120px] -z-10 print:hidden"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 blur-[120px] -z-10 print:hidden"></div>

                    {/* --- DOCUMENT HEADER --- */}
                    <div className="flex flex-col items-start justify-between pb-12 mb-12 border-b md:flex-row md:items-center border-white/5 print:border-slate-200">
                        <div className="mb-8 md:mb-0">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex items-center justify-center w-10 h-10 bg-teal-500 rounded-xl print:bg-slate-900">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                                </div>
                                <span className="text-3xl font-black tracking-tighter text-white print:text-slate-900">
                                    MediFlow <span className="ml-1 text-sm font-bold tracking-normal text-teal-500 uppercase">Health</span>
                                </span>
                            </div>
                            <p className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-500">Authorized Consultation Certificate</p>
                        </div>
                        <div className="text-left md:text-right">
                            <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1">Document Reference</p>
                            <h2 className="mb-2 font-mono text-2xl font-bold text-teal-400 print:text-slate-900">REF-{appointment.id.toString().padStart(6, '0')}</h2>
                            <p className="text-xs font-bold text-slate-400">Issued on {new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        </div>
                    </div>

                    {/* --- STAKEHOLDER INFORMATION GRID --- */}
                    <div className="grid grid-cols-1 gap-8 mb-16 md:grid-cols-2">
                        {/* Patient Details */}
                        <div className="p-8 border bg-white/[0.02] rounded-[2rem] border-white/5 print:bg-slate-50 print:border-slate-100">
                            <div className="flex items-center gap-2 mb-6">
                                <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                <h3 className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Patient Identity</h3>
                            </div>
                            <p className="mb-1 text-2xl font-black text-white print:text-slate-950">{appointment.user.name}</p>
                            <p className="text-sm font-medium text-slate-500">{appointment.user.email}</p>
                            <div className="pt-6 mt-6 border-t border-white/5 print:border-slate-200">
                                <p className="font-mono text-[10px] text-slate-500 uppercase tracking-tighter">System ID: UID-00{appointment.user.id}</p>
                            </div>
                        </div>

                        {/* Doctor Details */}
                        <div className="p-8 border bg-white/[0.02] rounded-[2rem] border-white/5 print:bg-slate-50 print:border-slate-100">
                            <div className="flex items-center gap-2 mb-6">
                                <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                                <h3 className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Medical Practitioner</h3>
                            </div>
                            <p className="mb-1 text-2xl font-black text-white print:text-slate-950">Dr. {appointment.doctor.user.name}</p>
                            <p className="text-sm italic font-black tracking-tighter text-teal-500 uppercase">{appointment.doctor.specialization}</p>
                            <div className="pt-6 mt-6 border-t border-white/5 print:border-slate-200">
                                <p className="text-[10px] font-bold text-slate-500 uppercase">{appointment.schedule.hospital.name}</p>
                            </div>
                        </div>
                    </div>

                    {/* --- CLINICAL SESSION SUMMARY --- */}
                    <div className="mb-12">
                        <div className="overflow-hidden border rounded-[2rem] border-white/5 print:border-slate-200">
                            <table className="w-full text-left">
                                <thead className="bg-white/[0.03] print:bg-slate-100">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-slate-500">Service Parameter</th>
                                        <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-slate-500 text-right">Validated Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 print:divide-slate-200">
                                    <tr>
                                        <td className="px-8 py-6 text-sm font-bold text-slate-300 print:text-slate-700">Date of Service</td>
                                        <td className="px-8 py-6 text-sm font-black text-right text-white print:text-slate-900">{appointment.date}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-8 py-6 text-sm font-bold text-slate-300 print:text-slate-700">Allocated Time Window</td>
                                        <td className="px-8 py-6 text-sm font-black text-right text-teal-400 print:text-slate-900">
                                            {appointment.schedule.start_time} — {appointment.schedule.end_time}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* --- CLINICAL ASSESSMENT & PLAN --- */}
                    {appointment.diagnosis && (
                        <div className="mb-16">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="h-[1px] flex-1 bg-white/10 print:bg-slate-200"></div>
                                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-teal-500">Clinical Assessment</h4>
                                <div className="h-[1px] flex-1 bg-white/10 print:bg-slate-200"></div>
                            </div>

                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                {/* Diagnosis Box */}
                                <div className="p-8 border bg-white/[0.02] rounded-[2rem] border-white/5 print:border-slate-200 print:bg-white">
                                    <h5 className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Primary Diagnosis</h5>
                                    <p className="text-sm font-medium leading-relaxed text-white whitespace-pre-wrap print:text-slate-900">{appointment.diagnosis}</p>
                                </div>

                                {/* Prescription Box */}
                                <div className="p-8 border bg-white/[0.02] rounded-[2rem] border-white/5 print:border-slate-200 print:bg-white">
                                    <h5 className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Prescribed Regimen</h5>
                                    <p className="font-mono text-sm font-medium leading-relaxed text-teal-400 whitespace-pre-wrap print:text-slate-900">{appointment.prescription}</p>
                                </div>

                                {/* Clinical Notes (If any) */}
                                {appointment.notes && (
                                    <div className="p-8 border md:col-span-2 bg-white/[0.02] rounded-[2rem] border-white/5 print:border-slate-200 print:bg-white">
                                        <h5 className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Remarks / Advice</h5>
                                        <p className="text-sm italic font-medium leading-relaxed text-slate-400 print:text-slate-700">{appointment.notes}</p>
                                    </div>
                                )}
                            </div>

                            {/* Next Visit Indicator */}
                            {appointment.next_visit_date && (
                                <div className="flex items-center justify-between p-6 mt-8 border bg-teal-500/10 border-teal-500/20 rounded-2xl print:bg-slate-50 print:border-slate-200">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center justify-center w-10 h-10 bg-teal-500 rounded-xl print:bg-slate-900">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-teal-500 print:text-slate-500">Scheduled Follow-up</p>
                                            <p className="text-sm font-bold text-white print:text-slate-900">
                                                {new Date(appointment.next_visit_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Verification Footer */}
                    <div className="max-w-xl mx-auto text-center">
                        <div className="flex justify-center mb-4 opacity-20 print:opacity-100">
                            <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        </div>
                        <p className="text-[11px] font-medium leading-relaxed text-slate-500 uppercase tracking-tighter">
                            This document is a digitally verified electronic health record.
                            <br />Generated securely by MediFlow Healthcare Management Systems.
                        </p>
                    </div>
                </div>

                {/* --- OPERATIONAL CONTROLS (Hidden when printing) --- */}
                <div className="flex flex-col max-w-4xl gap-4 mx-auto mt-12 md:flex-row print:hidden">
                    {/* Print Button */}
                    <button
                        onClick={handlePrint}
                        className="flex-1 flex items-center justify-center gap-3 py-5 font-black text-[11px] uppercase tracking-[0.2em] text-slate-900 transition bg-white hover:bg-slate-200 rounded-[1.5rem] shadow-2xl active:scale-95"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                        Print Receipt
                    </button>

                    {/* ✅ NEW: Download PDF Button */}
                    <button
                        onClick={handlePrint}
                        className="flex-1 flex items-center justify-center gap-3 py-5 font-black text-[11px] uppercase tracking-[0.2em] text-white transition bg-teal-600 hover:bg-teal-500 rounded-[1.5rem] shadow-xl shadow-teal-900/20 active:scale-95"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                        Download PDF
                    </button>

                    <Link
                        href={route('dashboard')}
                        className="px-12 py-5 font-black text-[11px] uppercase tracking-[0.2em] text-center text-slate-400 transition border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] rounded-[1.5rem]"
                    >
                        Exit Portal
                    </Link>
                </div>
            </div>

            {/* Print Logic Stylesheet */}
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    @page { margin: 15mm; size: auto; }
                    body { background: white !important; color: #0f172a !important; font-family: sans-serif; -webkit-print-color-adjust: exact; }
                    .print\\:text-slate-950 { color: #020617 !important; }
                    .print\\:text-slate-900 { color: #0f172a !important; }
                    .print\\:bg-slate-900 { background-color: #0f172a !important; }
                    .print\\:border-slate-200 { border-color: #e2e8f0 !important; }
                    .print\\:bg-slate-50 { background-color: #f8fafc !important; }
                    .print\\:divide-slate-200 > * + * { border-color: #e2e8f0 !important; }
                    /* Hide browser header/footer if possible */
                    @page { size: auto; margin: 0mm; }
                }
            `}} />
        </>
    );
}
