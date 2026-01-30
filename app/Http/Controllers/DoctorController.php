<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Doctor;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class DoctorController extends Controller
{
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

    public function update(Request $request, $id)
    {
        $request->validate([
            'specialization' => 'required|string',
        ]);

        $doctor = Doctor::findOrFail($id);

        $doctor->update([
            'specialization' => $request->specialization,
        ]);

        return redirect()->back()->with('message', 'Specialist details updated successfully.');
    }

    public function updateProfile(Request $request)
    {
        $request->validate([
            'specialization' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $user = auth()->user();
        $doctor = Doctor::firstOrNew(['user_id' => $user->id]);

        $doctor->specialization = $request->specialization;
        $doctor->bio = $request->bio;

        if ($request->hasFile('image')) {
            if ($doctor->exists && $doctor->image) {
                Storage::disk('public')->delete($doctor->image);
            }
            $path = $request->file('image')->store('doctors', 'public');
            $doctor->image = $path;
        }

        $doctor->save();

        return redirect()->back()->with('message', 'Professional profile updated successfully!');
    }
}