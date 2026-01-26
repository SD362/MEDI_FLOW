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

        return redirect()->back();
    }
}