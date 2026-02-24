<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Favori extends Model
{
    protected $fillable = ['user_id', 'annonce_id'];

    public function annonce()
    {
        return $this->belongsTo(Annonce::class)->with(['user', 'images', 'vitrineConfig']);
    }
}
