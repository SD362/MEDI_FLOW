<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'specialization',
        'bio',
        'image',
    ];

    // 1. Link to the User Account (Name, Email, Password)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // 2. THE FIX: Link to Schedules
    // This tells Laravel: "One Doctor has many Schedules"
    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }

    // 3. Link to Appointments
    // This tells Laravel: "One Doctor has many Appointments"
    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }
}
