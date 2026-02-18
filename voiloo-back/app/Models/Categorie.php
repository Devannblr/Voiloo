<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Categorie extends Model
{
    // On autorise tout le remplissage (pratique pour le développement)
    protected $guarded = [];

    protected $table = 'categories';

    // Une catégorie possède plusieurs annonces
    public function annonces(): HasMany
    {
        return $this->hasMany(Annonce::class, 'category_id');
    }
}
