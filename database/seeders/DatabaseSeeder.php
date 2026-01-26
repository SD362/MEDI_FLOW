<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Doctor;
use App\Models\Hospital;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create the Admin
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@medi.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // 2. Create a Doctor User
        $doctorUser = User::create([
            'name' => 'Dr. Smith',
            'email' => 'doctor@medi.com',
            'password' => Hash::make('password'),
            'role' => 'doctor',
        ]);

        // 3. Create the Doctor Profile linked to that User
        Doctor::create([
            'user_id' => $doctorUser->id,
            'specialization' => 'Cardiologist',
            'bio' => 'Heart specialist with 10 years experience.',
        ]);

        // 4. Create a Patient
        User::create([
            'name' => 'John Doe',
            'email' => 'patient@medi.com',
            'password' => Hash::make('password'),
            'role' => 'patient',
        ]);

        // 5. Create a Hospital
        Hospital::create([
            'name' => 'City General Hospital',
            'address' => '123 Main Street, Colombo',
            'contact_number' => '011-2233445',
        ]);
    }
}