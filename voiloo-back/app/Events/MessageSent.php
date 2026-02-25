<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Message $message)
    {
        // On s'assure que les relations nécessaires au broadcast sont là
        $this->message->loadMissing(['sender', 'conversation']);
    }

    public function broadcastOn(): array
    {
        $conv = $this->message->conversation;

        // Sécurité si la conv n'est pas chargée
        if (!$conv) return [];

        $recipientId = ($conv->user_one_id === $this->message->sender_id)
            ? $conv->user_two_id
            : $conv->user_one_id;

        return [
            new PrivateChannel('conversation.' . $this->message->conversation_id),
            new PrivateChannel('App.Models.User.' . $recipientId),
        ];
    }

    public function broadcastAs(): string
    {
        return 'MessageSent';
    }

    public function broadcastWith(): array
    {
        return [
            'message' => [
                'id' => $this->message->id,
                'conversation_id' => $this->message->conversation_id,
                'body' => $this->message->body,
                'sender_id' => $this->message->sender_id,
                'created_at' => $this->message->created_at,
                'read_at' => $this->message->read_at,
                'sender' => [
                    'id' => $this->message->sender->id,
                    'name' => $this->message->sender->name,
                    'avatar' => $this->message->sender->avatar ? url('storage/' . $this->message->sender->avatar) : null,
                ],
            ],
        ];
    }
}
