<?php

use App\Broadcasting\ConversationChannelPolicy;
use Illuminate\Support\Facades\Broadcast;

Broadcast::routes(['middleware' => ['auth:sanctum']]);

/**
 * Canal pour une conversation spécifique (fenêtre de chat ouverte)
 */
Broadcast::channel('conversation.{conversationId}', ConversationChannelPolicy::class);

/**
 * Canal privé de l'utilisateur pour les notifications globales (Badges, etc.)
 * On vérifie simplement que l'ID de l'utilisateur authentifié correspond à l'ID du canal.
 */
Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
