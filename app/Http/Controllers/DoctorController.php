<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Doctor;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

/**
 * DoctorController
 * Handles the administrative creation of doctor accounts and
 * manages professional profile details including imagery and specialization.
 */
class DoctorController extends Controller
{
    /**
     * Action: Register a new Doctor account.
     * Logic: Synchronizes User authentication data with a secondary Doctor profile.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'specialization' => 'required|string',
            'bio' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('doctors', 'public');
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'doctor',
        ]);

        Doctor::create([
            'user_id' => $user->id,
            'specialization' => $request->specialization,
            'bio' => $request->bio,
            'image' => $imagePath,
        ]);

        return redirect()->back()->with('message', 'Doctor created successfully!');
    }

    /**
     * Action: Update Doctor professional profile.
     * Logic: Handles specialization updates and performs disk clean-up
     * when replacing existing profile imagery.
     */
    public function updateProfile(Request $request)
    {
        $doctor = auth()->user()->doctor;

        $request->validate([
            'specialization' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $data = [
            'specialization' => $request->specialization,
        ];

        // Process file upload and storage management
        if ($request->hasFile('image')) {
            // Delete legacy image from public disk to conserve storage
            if ($doctor->image) {
                Storage::disk('public')->delete($doctor->image);
            }
            $data['image'] = $request->file('image')->store('doctors', 'public');
        }

        $doctor->update($data);

        return redirect()->back()->with('message', 'Professional profile updated successfully!');
    }
}
