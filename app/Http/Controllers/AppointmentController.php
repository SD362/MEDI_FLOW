<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment;
use App\Models\Schedule;
use Inertia\Inertia;

/**
 * AppointmentController
 * Orchestrates appointment lifecycles including creation, status transitions, and documentation.
 */
class AppointmentController extends Controller
{
    /**
     * Action: Persists a new appointment request.
     * Logic: Validates the schedule selection and ensures the date is set in the future.
     */
    public function store(Request $request)
    {
        $request->validate([
            'schedule_id' => 'required|exists:schedules,id',
            'date' => 'required|date|after:today',
        ]);

        $schedule = Schedule::findOrFail($request->schedule_id);

        Appointment::create([
            'user_id' => auth()->id(),
            'doctor_id' => $schedule->doctor_id,
            'schedule_id' => $schedule->id,
            'date' => $request->date,
            'status' => 'pending'
        ]);

        return redirect()->back()->with('message', 'Appointment Booked Successfully!');
    }

    /**
     * Action: Handle Status Changes & Clinical Finalization.
     * Logic: Handles simple status updates (Authorize/Discard) AND full clinical reporting.
     */
    public function update(Request $request, $id)
    {
        $appointment = Appointment::findOrFail($id);
        $user = auth()->user();

        // --- SECURITY CHECK: Patient Cancellation ---
        // Patients can only cancel their own appointments
        if ($user->role === 'patient' && $request->status === 'cancelled') {
            if ($appointment->user_id !== $user->id) {
                return back()->with('error', 'Unauthorized action.');
            }
        }

        // --- SCENARIO 1: Clinical Finalization (Doctor submits Report) ---
        // If the request contains a diagnosis, we know it's the "Finalize" form.
        if ($request->has('diagnosis')) {
            $validated = $request->validate([
                'diagnosis' => 'required|string',
                'prescription' => 'required|string',
                'notes' => 'nullable|string',
                'next_visit_date' => 'nullable|date|after:today',
                'status' => 'required|in:completed'
            ]);

            $appointment->update($validated);

            return back()->with('message', 'Consultation finalized & Report generated.');
        }

        // --- SCENARIO 2: Simple Status Update (Authorize/Discard/Confirm) ---
        $request->validate([
            'status' => 'required|in:confirmed,cancelled,completed'
        ]);

        $appointment->update([
            'status' => $request->status
        ]);

        return back()->with('message', 'Appointment status updated successfully!');
    }

    /**
     * Action: Generates a printable clinical record.
     * Logic: Restricts visibility to the owning patient and only for 'completed' visits.
     * The $appointment object now includes diagnosis/prescription data automatically.
     */
    public function showReceipt($id)
    {
        $appointment = Appointment::with(['doctor.user', 'schedule.hospital', 'user'])
            ->where('user_id', auth()->id())
            ->where('status', 'completed')
            ->findOrFail($id);

        return Inertia::render('AppointmentReceipt', [
            'appointment' => $appointment
        ]);
    }
}
