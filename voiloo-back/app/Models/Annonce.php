<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Annonce extends Model
{
    protected $guarded = [];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function categorie(): BelongsTo
    {
        return $this->belongsTo(Categorie::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(AnnonceImage::class);
    }

    public function avis()
    {
        return $this->hasMany(Avis::class);
    }
    // Config vitrine liée (couleurs, template, options)
    public function vitrineConfig(): HasOne
    {
        return $this->hasOne(VitrineConfig::class);
    }

    public function getAverageRatingAttribute(): float
    {
        return round($this->avis()->avg('note') ?? 0, 1);
    }

    public function getAvisCountAttribute(): int
    {
        return $this->avis()->count();
    }

    protected $appends = ['average_rating', 'avis_count'];
}
