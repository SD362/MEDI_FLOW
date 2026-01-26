<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\DoctorController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\AppointmentController;
use App\Models\Hospital;
use App\Models\Schedule;
use App\Models\Appointment;
use App\Models\Doctor;

// --- 1. LANDING PAGE (Public) ---
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// --- 2. DASHBOARD (Protected & Role-Based) ---
Route::get('/dashboard', function () {
    $role = auth()->user()->role;

    // A. Admin View
    if ($role === 'admin') {
        return Inertia::render('AdminDashboard');
    
    // B. Doctor View
    } elseif ($role === 'doctor') {
        $doctor = Doctor::where('user_id', auth()->id())->first();
        $hospitals = Hospital::all();
        
        $appointments = []; 

        if ($doctor) {
            $appointments = Appointment::where('doctor_id', $doctor->id)
                ->with(['user', 'schedule']) 
                ->get();
        }
        
        return Inertia::render('DoctorDashboard', [
            'hospitals' => $hospitals,
            'appointments' => $appointments,
        ]);

    // C. Patient View
    } else {
        // Search Logic
        $search = request('search');

        $schedules = Schedule::with(['doctor.user', 'hospital'])
            ->when($search, function ($query, $search) {
                return $query->whereHas('doctor', function ($q) use ($search) {
                    $q->where('specialization', 'like', "%{$search}%")
                      ->orWhereHas('user', function ($q2) use ($search) {
                          $q2->where('name', 'like', "%{$search}%");
                      });
                });
            })
            ->get();

        return Inertia::render('PatientDashboard', [
            'schedules' => $schedules,
            'filters' => request()->only(['search']),
        ]);
    }
})->middleware(['auth', 'verified'])->name('dashboard');

// --- 3. DOCTOR ACTIONS ---
Route::post('/doctors', [DoctorController::class, 'store'])
    ->middleware(['auth', 'verified'])
    ->name('doctors.store');

Route::post('/schedules', [ScheduleController::class, 'store'])
    ->middleware(['auth', 'verified'])
    ->name('schedules.store');

Route::patch('/appointments/{id}/status', [AppointmentController::class, 'updateStatus'])
    ->middleware(['auth', 'verified'])
    ->name('appointments.status');

// --- 4. PATIENT ACTIONS ---
Route::post('/appointments', [AppointmentController::class, 'store'])
    ->middleware(['auth', 'verified'])
    ->name('appointments.store');

// --- 5. PROFILE SETTINGS (Default Laravel) ---
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';