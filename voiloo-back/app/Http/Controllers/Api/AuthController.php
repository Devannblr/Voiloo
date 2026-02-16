<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'username' => 'required|string|min:3|alpha_dash|unique:users',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'username' => ltrim($request->username, '@'),
            'role' => 'user',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'user' => $user
        ], 201);
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

    public function checkUsername($username)
    {
        $cleanUsername = ltrim($username, '@');
        $exists = User::where('username', $cleanUsername)->exists();
        return response()->json(['available' => !$exists]);
    }

    public function checkEmail(Request $request)
    {
        $email = $request->query('email');

        if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return response()->json(['available' => null], 422);
        }

        $exists = User::where('email', $email)->exists();
        return response()->json(['available' => !$exists]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Identifiants invalides'], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $this->formatUserResponse($user)
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté avec succès']);
    }

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
            'join_date' => $user->join_date,
        ];
    }
}
