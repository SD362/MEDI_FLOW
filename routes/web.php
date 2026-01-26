<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Controllers
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\AppointmentController;

// Models
use App\Models\User;
use App\Models\Hospital;
use App\Models\Schedule;
use App\Models\Appointment;
use App\Models\Doctor;

// --- 1. LANDING PAGE ---
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// --- 2. CONTACT PAGE ---
Route::get('/contact', function () {
    return Inertia::render('Contact', [
        'canLogin' => Route::has('login'),
        'hospitals' => Hospital::orderBy('name', 'asc')->get() 
    ]);
})->name('contact');

// --- 3. PUBLIC SPECIALISTS DIRECTORY (✅ NEW ROUTE ADDED HERE) ---
Route::get('/specialists', function () {
    return Inertia::render('Specialists', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        // Fetch all doctors to show to the public
        'doctors' => Doctor::with(['user', 'schedules.hospital'])->get(),
        // Fetch categories for filtering
        'specialties' => Doctor::select('specialization')
            ->distinct()
            ->whereNotNull('specialization')
            ->orderBy('specialization', 'asc')
            ->pluck('specialization')
    ]);
})->name('specialists');


// --- 4. MAIN DASHBOARD ---
Route::get('/dashboard', function () {
    $user = auth()->user();
    $role = $user->role;

    // A. ADMIN VIEW
    if ($role === 'admin') {
        return Inertia::render('AdminDashboard', [
            'doctors' => Doctor::with('user')->get(),
            'patients' => User::where('role', 'patient')->get(),
            'appointments' => Appointment::with(['user', 'doctor.user', 'schedule'])->get(),
            'stats' => [
                'total_doctors' => Doctor::count(),
                'total_patients' => User::where('role', 'patient')->count(),
                'total_appointments' => Appointment::count(),
            ]
        ]);
    
    // B. DOCTOR VIEW
    } elseif ($role === 'doctor') {
        $doctor = Doctor::where('user_id', auth()->id())->first();
        $hospitals = Hospital::all();
        $appointments = $doctor 
            ? Appointment::where('doctor_id', $doctor->id)->with(['user', 'schedule'])->get() 
            : [];
        
        return Inertia::render('DoctorDashboard', [
            'hospitals' => $hospitals,
            'appointments' => $appointments,
        ]);

    // C. PATIENT VIEW
    } else {
        $search = request('search');

        // 1. Fetch DOCTORS (with their User info and Schedules)
        $doctors = Doctor::with(['user', 'schedules.hospital'])
            ->when($search, function ($query, $search) {
                return $query->where('specialization', 'like', "%{$search}%")
                      ->orWhereHas('user', function ($q2) use ($search) {
                          $q2->where('name', 'like', "%{$search}%");
                      });
            })
            ->get();

        // 2. Fetch Categories
        $specialties = Doctor::select('specialization')
            ->distinct()
            ->whereNotNull('specialization')
            ->orderBy('specialization', 'asc')
            ->pluck('specialization');

        return Inertia::render('PatientDashboard', [
            'doctors' => $doctors,
            'specialties' => $specialties,
            'filters' => request()->only(['search']),
        ]);
    }
})->middleware(['auth', 'verified'])->name('dashboard');

// --- 5. ACTIONS ---
Route::delete('/users/{id}', function ($id) {
    User::findOrFail($id)->delete();
    return redirect()->back();
})->middleware(['auth', 'verified'])->name('users.destroy');

Route::delete('/appointments/{id}', function ($id) {
    Appointment::findOrFail($id)->delete();
    return redirect()->back();
})->middleware(['auth', 'verified'])->name('appointments.destroy');

Route::post('/doctors', [DoctorController::class, 'store'])->middleware(['auth', 'verified'])->name('doctors.store');
Route::post('/schedules', [ScheduleController::class, 'store'])->middleware(['auth', 'verified'])->name('schedules.store');
Route::post('/appointments', [AppointmentController::class, 'store'])->middleware(['auth', 'verified'])->name('appointments.store');
Route::patch('/appointments/{id}/status', [AppointmentController::class, 'updateStatus'])->middleware(['auth', 'verified'])->name('appointments.status');

// --- 6. PROFILE ---
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';