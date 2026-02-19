<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Avis extends Model
{
    protected $guarded = [];

    // L'avis concerne une annonce
    public function annonce(): BelongsTo
    {
        return $this->belongsTo(Annonce::class);
    }

    // Changé "auteur" en "user" pour correspondre au code React et au Eager Loading
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'auteur_id');
    }
}
