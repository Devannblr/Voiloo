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
    // Pour calculer la moyenne des avis automatiquement
    public function getAverageRatingAttribute()
    {
        return round($this->avis()->avg('note') ?? 0, 1);
    }

    // Pour compter le nombre d'avis
    public function getAvisCountAttribute()
    {
        return $this->avis()->count();
    }

    // On demande à Laravel d'inclure ces données dans le JSON
    protected $appends = ['average_rating', 'avis_count'];
}
