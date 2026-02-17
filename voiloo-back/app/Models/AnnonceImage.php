<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnnonceImage extends Model
{
    protected $fillable = ['annonce_id', 'path'];

    public function annonce()
    {
        return $this->belongsTo(Annonce::class);
    }

}
