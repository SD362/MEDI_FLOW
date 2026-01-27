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
     * Action: Transitions appointment status (Confirm/Cancel/Complete).
     * Logic: Includes a security check to ensure patients can only cancel their own records.
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:confirmed,cancelled,completed'
        ]);

        $appointment = Appointment::findOrFail($id);

        /**
         * Security: Prevent unauthorized status changes.
         * Ensures patients can only initiate a 'cancelled' status on their own bookings.
         */
        if (auth()->user()->role === 'patient' && $request->status === 'cancelled') {
            if ($appointment->user_id !== auth()->id()) {
                return redirect()->back()->with('error', 'Unauthorized action.');
            }
        }

        $appointment->update([
            'status' => $request->status
        ]);

        return redirect()->back()->with('message', 'Appointment status updated successfully!');
    }

    /**
     * Action: Generates a printable clinical record.
     * Logic: Restricts visibility to the owning patient and only for 'completed' visits.
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
