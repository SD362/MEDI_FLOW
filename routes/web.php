<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DoctorController;
use App\Models\Hospital;
use App\Http\Controllers\ScheduleController;
use App\Models\Schedule;
use App\Http\Controllers\AppointmentController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    $role = auth()->user()->role;

    if ($role === 'admin') {
        return Inertia::render('AdminDashboard');
    } elseif ($role === 'doctor') {
        // ✅ Get all hospitals so the doctor can pick one
        $hospitals = Hospital::all(); 
        
        return Inertia::render('DoctorDashboard', [
            'hospitals' => $hospitals
        ]);
    } else {
        $schedules = Schedule::with(['doctor.user', 'hospital'])->get();

        return Inertia::render('PatientDashboard', [
        'schedules' => $schedules
        ]);
    }
})->middleware(['auth', 'verified'])->name('dashboard');

Route::post('/doctors', [DoctorController::class, 'store'])
    ->middleware(['auth', 'verified'])
    ->name('doctors.store');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::post('/schedules', [ScheduleController::class, 'store'])
    ->middleware(['auth', 'verified'])
    ->name('schedules.store');

Route::post('/appointments', [AppointmentController::class, 'store'])
    ->middleware(['auth', 'verified'])
    ->name('appointments.store');



require __DIR__.'/auth.php';
