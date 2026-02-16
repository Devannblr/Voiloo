<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'username',
        'role',
    ];

// Pour voir ses propres annonces
    public function annonces() {
        return $this->hasMany(Annonce::class);
    }

    public function avisRecus()
    {
        return $this->hasMany(Avis::class, 'vendeur_id');
    }

    public function noteMoyenne()
    {
        return $this->avisRecus()->avg('note') ?: 0; // Retourne 0 si pas encore d'avis
    }

// Pour voir ses favoris (Très important pour ta page profil !)
    public function favoris() {
        return $this->belongsToMany(Annonce::class, 'favoris');
    }

// Dans app/Models/User.php
    public function isAdmin(): bool
    {
        return $this->role === 'admin'; // Assure-toi que la colonne 'role' existe en BDD
    }
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
