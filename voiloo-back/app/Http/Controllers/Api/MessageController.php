<?php

namespace App\Http\Controllers\Api;

use App\Events\MessageSent;
use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    /**
     * GET /conversations
     */
    public function conversations(Request $request)
    {
        $userId = $request->user()->id;

        $conversations = Conversation::with([
            'userOne:id,name,avatar,username',
            'userTwo:id,name,avatar,username',
            'lastMessage.sender:id,name',
            'annonce:id,titre,slug',
        ])
            ->where('user_one_id', $userId)
            ->orWhere('user_two_id', $userId)
            ->orderByDesc('last_message_at')
            ->get()
            ->map(function ($conv) use ($userId) {
                return [
                    'id'           => $conv->id,
                    'other_user'   => $conv->otherUser($userId),
                    'annonce'      => $conv->annonce,
                    'last_message' => $conv->lastMessage,
                    'unread_count' => $conv->unreadCount($userId),
                    'updated_at'   => $conv->last_message_at,
                ];
            });

        return response()->json($conversations);
    }

    /**
     * GET /conversations/{id}/messages
     */
    public function messages(Request $request, int $conversationId)
    {
        $userId = $request->user()->id;
        $conv   = Conversation::findOrFail($conversationId);

        abort_if($conv->user_one_id !== $userId && $conv->user_two_id !== $userId, 403);

        $messages = $conv->messages()->with('sender:id,name,avatar')->get();

        return response()->json($messages);
    }

    /**
     * POST /conversations — Créer ou récupérer une conversation
     * ✅ Gère maintenant le retour complet pour l'affichage direct
     */
    public function startOrGet(Request $request)
    {
        $request->validate([
            'recipient_id' => 'required|exists:users,id',
            'annonce_id'   => 'nullable|exists:annonces,id',
            'body'         => 'nullable|string|max:2000',
        ]);

        $userId      = $request->user()->id;
        $recipientId = (int)$request->recipient_id;

        if ($userId === $recipientId) {
            return response()->json(['message' => 'Auto-contact interdit'], 422);
        }

        return DB::transaction(function () use ($userId, $recipientId, $request) {
            [$one, $two] = $userId < $recipientId ? [$userId, $recipientId] : [$recipientId, $userId];

            // On trouve ou crée la conversation
            // Si elle existe déjà mais pour une autre annonce, on peut décider d'en créer une nouvelle
            // ou de rester sur la même. Ici on reste sur l'existant.
            $conv = Conversation::firstOrCreate(
                ['user_one_id' => $one, 'user_two_id' => $two],
                ['annonce_id' => $request->annonce_id, 'last_message_at' => now()]
            );

            // Si un message est fourni (premier contact avec texte)
            if ($request->filled('body')) {
                $conv->update(['last_message_at' => now()]);
                return $this->send($request, $conv->id);
            }

            // Si pas de message (ouverture directe via "Contacter")
            // On s'assure de charger l'annonce et les utilisateurs pour le frontend
            return response()->json([
                'id'           => $conv->id,
                'other_user'   => $conv->otherUser($userId),
                'annonce'      => $conv->annonce()->select('id', 'titre', 'slug')->first(),
                'last_message' => null,
                'unread_count' => 0,
                'updated_at'   => $conv->last_message_at,
            ]);
        });
    }

    /**
     * POST /conversations/{id}/messages — Envoyer un message
     */
    public function send(Request $request, int $conversationId)
    {
        $request->validate(['body' => 'required|string|max:2000']);

        $userId = $request->user()->id;
        $conv   = Conversation::findOrFail($conversationId);

        abort_if($conv->user_one_id !== $userId && $conv->user_two_id !== $userId, 403);

        $message = Message::create([
            'conversation_id' => $conv->id,
            'sender_id'       => $userId,
            'body'            => $request->body,
            'read_at'         => null,
        ]);

        $conv->update(['last_message_at' => now()]);
        $message->load('sender:id,name,avatar');

        try {
            broadcast(new MessageSent($message))->toOthers();
        } catch (\Exception $e) {
            Log::error("Broadcast failed: " . $e->getMessage());
        }

        return response()->json($message, 201);
    }

    /**
     * POST /conversations/{id}/read
     */
    public function markAsRead(int $id)
    {
        $userId = auth()->id();

        Message::where('conversation_id', $id)
            ->where('sender_id', '!=', $userId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['status' => 'success']);
    }

    /**
     * GET /messages/unread-count
     */
    public function unreadCount(Request $request)
    {
        $userId = $request->user()->id;

        $count = Message::whereHas('conversation', function ($q) use ($userId) {
            $q->where('user_one_id', $userId)->orWhere('user_two_id', $userId);
        })
            ->where('sender_id', '!=', $userId)
            ->whereNull('read_at')
            ->count();

        return response()->json(['count' => $count]);
    }

    /**
     * DELETE /messages/{id}
     */
    public function deleteMessage(int $id)
    {
        $message = Message::findOrFail($id);
        abort_if($message->sender_id !== auth()->id(), 403);

        $message->delete();
        return response()->json(['status' => 'success']);
    }
}
