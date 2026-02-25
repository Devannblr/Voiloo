<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UserController extends Controller
{
    // ✅ On cherche maintenant par username directement
    public function showBySlug(string $username)
    {
        $user = User::where('username', $username)
            ->select('id', 'name', 'username', 'avatar', 'bio', 'localisation', 'activity', 'email_verified_at')
            ->firstOrFail();

        if ($user->avatar && !str_starts_with($user->avatar, 'http')) {
            $user->avatar = url('storage/' . $user->avatar);
        }

        $annonces = $user->annonces()->with(['images', 'categorie', 'vitrineConfig'])->get();
        return response()->json(['user' => $user, 'annonces' => $annonces]);
    }

    public function user(Request $request)
    {
        $user = $request->user();
        if ($user->avatar && !str_starts_with($user->avatar, 'http')) {
            $user->avatar = url('storage/' . $user->avatar);
        }
        return response()->json($user);
    }
    public function me(Request $request)
    {
        $user = $request->user();
        if ($user->avatar && !str_starts_with($user->avatar, 'http')) {
            $user->avatar = url('storage/' . $user->avatar);
        }

        $token = $request->bearerToken()
            ?? $request->cookie('voiloo_token');

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            // ✅ alpha_dash garantit : lettres, chiffres, tirets et underscores uniquement
            'username' => 'sometimes|alpha_dash|max:50|unique:users,username,' . $user->id,
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'localisation' => 'sometimes|nullable|string|max:255',
            'activity' => 'sometimes|nullable|string|max:255',
            'bio' => 'sometimes|nullable|string|max:1000',
            'avatar' => 'sometimes|image|mimes:jpeg,png,jpg|max:5120',
        ]);

        // ✅ GESTION DE L'AVATAR
        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }

            $file = $request->file('avatar');
            $currentUsername = $validated['username'] ?? $user->username;
            // On s'assure que le nom de fichier est propre
            $filename = 'avatar-' . $currentUsername . '-' . time() . '.' . $file->extension();

            $path = $file->storeAs('avatars', $filename, 'public');
            $validated['avatar'] = $path;
        }

        if (isset($validated['email']) && $validated['email'] !== $user->email) {
            $user->email_verified_at = null;
        }

        $user->fill($validated);
        $user->save();

        $updatedUser = $user->fresh();
        if ($updatedUser->avatar && !str_starts_with($updatedUser->avatar, 'http')) {
            $updatedUser->avatar = url('storage/' . $updatedUser->avatar);
        }

        return response()->json([
            'message' => 'Profil mis à jour.',
            'user' => $updatedUser
        ]);
    }

    public function changePassword(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8',
        ]);

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json(['message' => 'Mot de passe actuel incorrect'], 403);
        }

        $user->update(['password' => Hash::make($validated['new_password'])]);
        return response()->json(['message' => 'Mot de passe modifié']);
    }

    public function sendVerification(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email déjà vérifié']);
        }
        $request->user()->sendEmailVerificationNotification();
        return response()->json(['message' => 'Email de vérification envoyé']);
    }

    public function verifyEmail(Request $request, $id, $hash)
    {
        if (!$request->hasValidSignature()) {
            return response()->json(['message' => 'Lien invalide ou expiré'], 403);
        }

        $user = User::findOrFail($id);

        if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return response()->json(['message' => 'Lien invalide'], 403);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email déjà vérifié']);
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return response()->json(['message' => 'Email vérifié avec succès']);
    }

    public function deleteAccount(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate(['password' => 'required']);

        if (!Hash::check($validated['password'], $user->password)) {
            return response()->json(['message' => 'Mot de passe incorrect'], 403);
        }

        $user->annonces()->delete();
        $user->delete();

        return response()->json(['message' => 'Compte supprimé']);
    }
}
