<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'username',
        'avatar',
        'localisation',
        'activity',
        'bio',
    ];

    protected $appends = ['join_date'];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function getJoinDateAttribute()
    {
        return $this->created_at->translatedFormat('F Y');
    }

    // ✅ Accesseur optionnel pour toujours avoir l'URL complète
    public function getAvatarUrlAttribute()
    {
        return $this->avatar
            ? url('storage/' . $this->avatar)
            : null;
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
        return $this->role === 'admin';
    }
}
