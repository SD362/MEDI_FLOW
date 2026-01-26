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
        // 1. Validate
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'specialization' => 'required|string',
            'bio' => 'nullable|string',
            'image' => 'nullable|image|max:2048', // Max 2MB file
        ]);

        // 2. Handle Image Upload
        $imagePath = null;
        if ($request->hasFile('image')) {
            // This saves the file into 'storage/app/public/doctors'
            $imagePath = $request->file('image')->store('doctors', 'public'); 
        }

        // 3. Create User Login
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => \Illuminate\Support\Facades\Hash::make($request->password),
            'role' => 'doctor',
        ]);

        // 4. Create Doctor Profile (with Image)
        \App\Models\Doctor::create([
            'user_id' => $user->id,
            'specialization' => $request->specialization,
            'bio' => $request->bio,
            'image' => $imagePath, // Save the file path to database
        ]);

        return redirect()->back()->with('message', 'Doctor created successfully!');
    }
}