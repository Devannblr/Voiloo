<?php

namespace App\Broadcasting;

use App\Models\Conversation;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class ConversationChannelPolicy
{
    public function join(User $user, int $conversationId): bool
    {
        Log::info('🔐 Broadcasting auth attempt', [
            'user_id' => $user->id,
            'user_email' => $user->email,
            'conversation_id' => $conversationId,
        ]);

        $conv = Conversation::find($conversationId);

        if (!$conv) {
            Log::warning('❌ Conversation not found', [
                'conversation_id' => $conversationId,
            ]);
            return false;
        }

        Log::info('📦 Conversation found', [
            'user_one_id' => $conv->user_one_id,
            'user_two_id' => $conv->user_two_id,
        ]);

        $hasAccess = (int) $conv->user_one_id === $user->id
            || (int) $conv->user_two_id === $user->id;

        Log::info($hasAccess ? '✅ ACCESS GRANTED' : '❌ ACCESS DENIED', [
            'user_id' => $user->id,
            'user_one_id' => $conv->user_one_id,
            'user_two_id' => $conv->user_two_id,
            'match_one' => (int) $conv->user_one_id === $user->id,
            'match_two' => (int) $conv->user_two_id === $user->id,
        ]);

        return $hasAccess;
    }
}
