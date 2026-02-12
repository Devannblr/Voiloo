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

    // L'auteur de l'avis
    public function auteur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'auteur_id');
    }
}
