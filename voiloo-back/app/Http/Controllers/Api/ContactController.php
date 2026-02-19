<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Annonce;
use App\Mail\ContactVitrineMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function send(Request $request)
    {
        $validated = $request->validate([
            'nom'        => 'required|string|max:100',
            'email'      => 'required|email',
            'message'    => 'required|string|max:2000',
            'annonce_id' => 'required|exists:annonces,id',
        ]);

        // On récupère l'annonceur via l'annonce
        $annonce = Annonce::with('user')->findOrFail($validated['annonce_id']);
        $destinataire = $annonce->user->email;

        try {
            Mail::to($destinataire)->send(new ContactVitrineMail($validated));
            return response()->json(['message' => 'Email envoyé avec succès']);
        } catch (\Exception $e) {
            // Cela va écrire l'erreur précise dans storage/logs/laravel.log
            \Log::error("Erreur SMTP : " . $e->getMessage());

            return response()->json([
                'message' => "Erreur technique lors de l'envoi",
                'debug' => $e->getMessage() // À retirer en production
            ], 500);
        }
    }
}
