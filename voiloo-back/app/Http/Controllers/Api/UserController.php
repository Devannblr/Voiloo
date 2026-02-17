<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function user(Request $request)
    {
        return response()->json($this->formatUserResponse($request->user()));
    }

    // ✅ Méthode centralisée pour formater la réponse utilisateur
    private function formatUserResponse(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'username' => $user->username,
            'localisation' => $user->localisation,
            'bio' => $user->bio,
            'activity' => $user->activity,
            // ✅ Construire l'URL complète UNIQUEMENT dans la réponse
            'avatar' => $user->avatar
                ? url('storage/' . $user->avatar)
                : null,
            'created_at' => $user->created_at,
        ];
    }

    public function update(Request $request)
    {
        $user = $request->user();

        // Validation
        $validated = $request->validate([
            'name'         => 'sometimes|string|max:255',
            'localisation' => 'sometimes|nullable|string|max:255',
            'bio'          => 'sometimes|nullable|string',
            'activity'     => 'sometimes|nullable|string',
            'avatar'       => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        // ✅ Gestion de l'Avatar avec nom personnalisé
        if ($request->hasFile('avatar') && $request->file('avatar')->isValid()) {

            // 🗑️ Supprimer l'ancien avatar s'il existe
            if ($user->avatar && $user->avatar !== '/poulet.jpg') {
                Storage::disk('public')->delete($user->avatar);
            }

            // ✅ Créer un nom de fichier personnalisé : username + timestamp + extension
            $file = $request->file('avatar');
            $extension = $file->getClientOriginalExtension();
            $filename = $user->username . '_' . time() . '.' . $extension;

            // Stocker dans le dossier avatars
            $path = $file->storeAs('avatars', $filename, 'public');

            // ✅ Stocker UNIQUEMENT le chemin relatif en BDD
            $validated['avatar'] = $path; // Ex: "avatars/johndoe_1708123456.jpg"

            \Log::info('Avatar stocké:', [
                'path' => $path,
                'filename' => $filename,
                'user' => $user->username
            ]);
        }

        // Mise à jour de l'utilisateur
        $user->update($validated);
        $user->refresh();

        return response()->json([
            'message' => 'Profil mis à jour avec succès',
            'user' => $this->formatUserResponse($user)
        ]);
    }
}
