<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Annonce extends Model
{
    protected $guarded = [];

    // L'annonce appartient à un utilisateur
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // L'annonce appartient à une catégorie
    public function categorie(): BelongsTo
    {
        return $this->belongsTo(Categorie::class);
    }

    // Une annonce peut avoir plusieurs images
    public function images(): HasMany
    {
        return $this->hasMany(AnnonceImage::class);
    }

    // Une annonce peut avoir plusieurs avis
    public function avis(): HasMany
    {
        return $this->hasMany(Avis::class);
    }
}
