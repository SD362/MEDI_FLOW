<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'doctor_id',
        'schedule_id',
        'date',
        'status',
        // ✅ Added new fields for Clinical Finalization
        'diagnosis',
        'prescription',
        'notes',
        'next_visit_date'
    ];

    // ✅ Relationship to the Patient (User)
    public function user() {
        return $this->belongsTo(User::class);
    }

    // ✅ Relationship to the Schedule (Time slot)
    public function schedule() {
        return $this->belongsTo(Schedule::class);
    }

    // ✅ Relationship to the Doctor
    public function doctor() {
        return $this->belongsTo(Doctor::class);
    }
}
