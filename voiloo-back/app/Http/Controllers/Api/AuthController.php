<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Inscription d'un nouvel utilisateur avec vérification Cloudflare Turnstile
     */
    public function register(Request $request)
    {
        // 1. Validation des données entrantes
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'username' => 'required|string|min:3|alpha_dash|unique:users',
            'cf_turnstile_token' => 'required|string',
        ]);

        // 2. Vérification Cloudflare
        $response = Http::asForm()->post('https://challenges.cloudflare.com/turnstile/v0/siteverify', [
            'secret'   => config('services.cloudflare.cf_secret'),
            'response' => $request->cf_turnstile_token,
            'remoteip' => $request->ip(),
        ]);

        if (!$response->json('success')) {
            return response()->json([
                'message' => 'La vérification de sécurité a échoué. Veuillez réessayer.'
            ], 403);
        }

        // 3. Création de l'utilisateur
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'username' => ltrim($request->username, '@'),
            'role' => 'user',
        ]);

        // 4. Token et Cookie
        $token = $user->createToken('auth_token')->plainTextToken;
        $cookie = $this->generateAuthCookie($token);

        return response()->json([
            'access_token' => $token,
            'user' => $this->formatUserResponse($user)
        ], 201)->withCookie($cookie);
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
        $cookie = $this->generateAuthCookie($token);

        return response()->json([
            'access_token' => $token,
            'user' => $this->formatUserResponse($user)
        ])->withCookie($cookie);
    }

    /**
     * Centralisation de la création du cookie pour éviter les erreurs
     */
    private function generateAuthCookie($token)
    {
        return cookie(
            'voiloo_token', // Nom plus précis
            $token,
            60 * 24 * 7,    // 7 jours
            '/',
            null,
            true,           // Toujours Secure en 2026
            true,           // HttpOnly (empêche le JS de le voler)
            false,
            'Lax'
        );
    }

    private function formatUserResponse(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'username' => $user->username,
            'avatar' => $user->avatar ? url('storage/' . $user->avatar) : null,
            'created_at' => $user->created_at,
        ];
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

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté avec succès'])->withoutCookie('voiloo_token');
    }

    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $status = Password::sendResetLink($request->only('email'));

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => 'Lien envoyé.'])
            : response()->json(['message' => 'Erreur.'], 400);
    }

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
            ? response()->json(['message' => 'Mot de passe réinitialisé.'])
            : response()->json(['message' => 'Erreur.'], 400);
    }
}
