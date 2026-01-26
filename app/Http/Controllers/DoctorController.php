<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Doctor;
use Illuminate\Support\Facades\Hash;

class DoctorController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validate the form data
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'specialization' => 'required|string',
            'bio' => 'nullable|string',
        ]);

        // 2. Create the User Login Account (Role = Doctor)
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'doctor',
        ]);

        // 3. Create the Doctor Profile linked to that User
        Doctor::create([
            'user_id' => $user->id,
            'specialization' => $request->specialization,
            'bio' => $request->bio,
        ]);

        // 4. Go back to dashboard with success message
        return redirect()->back()->with('message', 'Doctor created successfully!');
    }
}