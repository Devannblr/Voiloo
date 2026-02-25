<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'conversation_id',
        'sender_id',
        'body',
        'read_at'
    ];

    protected $casts = [
        'read_at' => 'datetime',
    ];

    /**
     * ✅ Met à jour automatiquement le timestamp 'updated_at' de la conversation
     * à chaque fois qu'un message est créé ou modifié.
     */
    protected $touches = ['conversation'];

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }
}
