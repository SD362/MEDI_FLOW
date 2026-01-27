<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Schedule;
use App\Models\Doctor;

class ScheduleController extends Controller
{
    public function store(Request $request)
    {
        // 1. Get the logged-in user's Doctor Profile
        $doctor = Doctor::where('user_id', auth()->id())->first();

        // ✅ SAFETY CHECK: If no doctor profile exists, stop here (prevents crash)
        if (!$doctor) {
            return redirect()->back()->withErrors(['error' => 'Doctor profile not found.']);
        }

        // 2. Validate
        $request->validate([
            'hospital_id' => 'required|exists:hospitals,id',
            'day' => 'required|string',
            'start_time' => 'required',
            'end_time' => 'required|after:start_time',
        ]);

        // 3. Save the Schedule
        Schedule::create([
            'doctor_id' => $doctor->id,
            'hospital_id' => $request->hospital_id,
            'day' => $request->day,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
        ]);

        // ✅ Return with success message
        return redirect()->back()->with('message', 'Availability slot added successfully!');
    }

    public function destroy($id)
    {
        $schedule = Schedule::findOrFail($id);

        // Security check: Ensure only the doctor who owns the slot can delete it
        if ($schedule->doctor_id !== auth()->user()->doctor->id) {
            return redirect()->back()->with('error', 'Unauthorized action.');
        }

        $schedule->delete();

        return redirect()->back()->with('message', 'Availability removed successfully.');
    }

}
