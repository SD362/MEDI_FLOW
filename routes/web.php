<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\HospitalController;
use App\Http\Controllers\ContactController;
use App\Models\User;
use App\Models\Hospital;
use App\Models\Schedule;
use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\ContactMessage;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'doctorCount' => Doctor::count(),
    ]);
});

Route::get('/contact', function () {
    return Inertia::render('Contact', [
        'canLogin' => Route::has('login'),
        'hospitals' => Hospital::orderBy('name', 'asc')->get()
    ]);
})->name('contact');

Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

Route::get('/specialists', function () {
    return Inertia::render('Specialists', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'doctors' => Doctor::with(['user', 'schedules.hospital'])->get(),
        'specialties' => Doctor::select('specialization')
            ->distinct()
            ->whereNotNull('specialization')
            ->orderBy('specialization', 'asc')
            ->pluck('specialization')
    ]);
})->name('specialists');

Route::get('/dashboard', function () {
    $user = auth()->user();
    $role = $user->role;

    if ($role === 'admin') {
        return Inertia::render('AdminDashboard', [
            'doctors' => Doctor::with('user')->get(),
            'patients' => User::where('role', 'patient')->get(),
            'hospitals' => Hospital::all(),
            'appointments' => Appointment::with(['user', 'doctor.user', 'schedule.hospital'])->get(),
            'messages' => ContactMessage::orderBy('created_at', 'desc')->get(),
            'stats' => [
                'total_doctors' => Doctor::count(),
                'total_patients' => User::where('role', 'patient')->count(),
                'total_appointments' => Appointment::count(),
                'total_messages' => ContactMessage::count(),
            ]
        ]);

    } elseif ($role === 'doctor') {
        $doctor = Doctor::where('user_id', auth()->id())->first();
        $hospitals = Hospital::all();

        $appointments = $doctor
            ? Appointment::where('doctor_id', $doctor->id)->with(['user', 'schedule.hospital'])->get()
            : [];

        $mySchedules = $doctor
            ? Schedule::where('doctor_id', $doctor->id)->with('hospital')->get()
            : [];

        return Inertia::render('DoctorDashboard', [
            'hospitals' => $hospitals,
            'appointments' => $appointments,
            'mySchedules' => $mySchedules,
        ]);

    } else {
        $search = request('search');

        $doctors = Doctor::with(['user', 'schedules.hospital'])
            ->when($search, function ($query, $search) {
                return $query->where('specialization', 'like', "%{$search}%")
                      ->orWhereHas('user', function ($q2) use ($search) {
                          $q2->where('name', 'like', "%{$search}%");
                      });
            })
            ->get();

        $myAppointments = Appointment::where('user_id', auth()->id())
            ->with(['doctor.user', 'schedule.hospital'])
            ->orderBy('date', 'desc')
            ->get();

        $specialties = Doctor::select('specialization')
            ->distinct()
            ->whereNotNull('specialization')
            ->orderBy('specialization', 'asc')
            ->pluck('specialization');

        return Inertia::render('PatientDashboard', [
            'doctors' => $doctors,
            'specialties' => $specialties,
            'myAppointments' => $myAppointments,
            'filters' => request()->only(['search', 'doctor_id']),
        ]);
    }
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::delete('/users/{id}', function ($id) {
        User::findOrFail($id)->delete();
        return redirect()->back();
    })->name('users.destroy');

    Route::post('/doctors', [DoctorController::class, 'store'])->name('doctors.store');
    Route::patch('/doctors/{id}', [DoctorController::class, 'update'])->name('doctors.update');
    Route::post('/doctor/profile/update', [DoctorController::class, 'updateProfile'])->name('doctor.profile.update');
    
    Route::post('/schedules', [ScheduleController::class, 'store'])->name('schedules.store');
    Route::delete('/schedules/{id}', [ScheduleController::class, 'destroy'])->name('schedules.destroy');

    Route::post('/hospitals', [HospitalController::class, 'store'])->name('hospitals.store');
    Route::patch('/hospitals/{id}', [HospitalController::class, 'update'])->name('hospitals.update');
    Route::delete('/hospitals/{id}', [HospitalController::class, 'destroy'])->name('hospitals.destroy');

    Route::post('/appointments', [AppointmentController::class, 'store'])->name('appointments.store');
    
    Route::delete('/appointments/{id}', function ($id) {
        Appointment::findOrFail($id)->delete();
        return redirect()->back();
    })->name('appointments.destroy');

    Route::patch('/appointments/{id}/status', [AppointmentController::class, 'update'])->name('appointments.status');
    Route::patch('/appointments/{id}', [AppointmentController::class, 'update'])->name('appointments.update');
    Route::get('/appointments/{id}/receipt', [AppointmentController::class, 'showReceipt'])->name('appointments.receipt');

    Route::delete('/contact/{id}', [ContactController::class, 'destroy'])->name('contact.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';