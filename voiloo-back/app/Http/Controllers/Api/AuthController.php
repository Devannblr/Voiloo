<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;

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

    // ✅ MOT DE PASSE OUBLIÉ : Envoi du lien
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        // On utilise le broker par défaut de Laravel
        $status = Password::sendResetLink(
            $request->only('email')
        );

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => 'Lien de réinitialisation envoyé par email.'])
            : response()->json(['message' => 'Impossible d\'envoyer le lien.'], 400);
    }

    // ✅ MOT DE PASSE OUBLIÉ : Nouveau mot de passe
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => ['required', 'min:8', 'confirmed'],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();
            }
        );

        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => 'Votre mot de passe a été réinitialisé.'])
            : response()->json(['message' => 'Lien invalide ou expiré.'], 400);
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
            'avatar' => $user->avatar ? url('storage/' . $user->avatar) : null,
            'created_at' => $user->created_at,
        ];
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté avec succès']);
    }
}
