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
        'image', // <--- Add this line
    ];

    // Optional but helpful: Tell Laravel that a Doctor belongs to a User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}