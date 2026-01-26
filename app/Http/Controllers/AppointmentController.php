<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment;
use App\Models\Schedule;

class AppointmentController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validate
        $request->validate([
            'schedule_id' => 'required|exists:schedules,id',
            'date' => 'required|date|after:today', // Must book for future
        ]);

        // 2. Find the Schedule details to get the doctor_id
        $schedule = Schedule::findOrFail($request->schedule_id);

        // 3. Create Appointment
        Appointment::create([
            'user_id' => auth()->id(), // The logged-in patient
            'doctor_id' => $schedule->doctor_id,
            'schedule_id' => $schedule->id,
            'date' => $request->date,
            'status' => 'pending'
        ]);

        return redirect()->back()->with('message', 'Appointment Booked Successfully!');
    }
}