<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VitrineConfig extends Model
{
    protected $fillable = [
        'user_id', 'annonce_id',
        'couleur_principale', 'couleur_texte', 'couleur_fond',
        'header_photo', 'slogan', 'sections',
        'instagram', 'linkedin', 'site_web', 'facebook', 'twitter',
        'template', 'options', 'show_contact_form',
    ];

    protected $casts = [
        'options'           => 'array',
        'sections'          => 'array',
        'show_contact_form' => 'boolean',
    ];

    protected $attributes = [
        'couleur_principale' => '#FFD359',
        'couleur_texte'      => '#1A1A1A',
        'couleur_fond'       => '#FFFFFF',
        'template'           => 'default',
        'show_contact_form'  => true,
    ];

    public function annonce(): BelongsTo
    {
        return $this->belongsTo(Annonce::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
