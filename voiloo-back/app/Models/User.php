<?php

namespace App\Models;

use App\Notifications\CustomVerifyEmail;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'avatar',
        'bio',
        'localisation',
        'activity',
        'avis',
        'date_naissance',
        'created_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function sendEmailVerificationNotification()
    {
        $this->notify(new CustomVerifyEmail);
    }

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function getJoinDateAttribute()
    {
        return $this->created_at ? $this->created_at->translatedFormat('F Y') : null;
    }

    public function getAvatarUrlAttribute()
    {
        return $this->avatar ? url('storage/' . $this->avatar) : null;
    }

    public function annonces()
    {
        return $this->hasMany(Annonce::class);
    }

    public function avisRecus()
    {
        return $this->hasMany(Avis::class, 'vendeur_id');
    }

    public function noteMoyenne()
    {
        return $this->avisRecus()->avg('note') ?: 0;
    }

    public function favoris()
    {
        return $this->belongsToMany(Annonce::class, 'favoris');
    }

    public function isAdmin(): bool
    {
        return isset($this->role) && $this->role === 'admin';
    }
}
