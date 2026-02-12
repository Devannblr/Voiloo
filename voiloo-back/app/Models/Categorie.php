<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Categorie extends Model
{
    protected $guarded = [];

    // Une catégorie a plusieurs annonces
    public function annonces(): HasMany
    {
        return $this->hasMany(Annonce::class);
    }
}
