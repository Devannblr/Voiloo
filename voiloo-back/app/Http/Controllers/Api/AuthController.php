<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // INSCRIPTION (Pour ton SignupForm)
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'username' => 'required|string|min:3|alpha_dash|unique:users', // alpha_dash autorise (_) et (-)
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'username' => ltrim($request->username, '@'), // On nettoie avant de stocker
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

        // On valide les champs que tu as dans ton interface ProfilCard
        $validated = $request->validate([
            'name'     => 'sometimes|string|max:255',
            'username' => [
                'sometimes',
                'string',
                'max:255',
                Rule::unique('users')->ignore($user->id)
            ],
            'location' => 'sometimes|nullable|string|max:255',
            'activity' => 'sometimes|nullable|string|max:255',
            'intent'   => 'sometimes|nullable|string|max:2000', // Ta bio/description
        ]);

        // Mise à jour en base de données
        $user->update($validated);

        return response()->json([
            'message' => 'Profil mis à jour !',
            'user'    => $user
        ]);
    }
    public function checkUsername($username)
    {
        // On enlève l'arobase si jamais il arrive quand même
        $cleanUsername = ltrim($username, '@');

        // On vérifie directement la colonne username
        $exists = User::where('username', $cleanUsername)->exists();

        return response()->json([
            'available' => !$exists
        ]);
    }

    public function checkEmail(Request $request)
    {
        // On récupère l'email depuis l'URL (?email=...)
        $email = $request->query('email');

        if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return response()->json(['available' => null], 422);
        }

        $exists = User::where('email', $email)->exists();

        return response()->json(['available' => !$exists]);
    }

    // CONNEXION (Pour ton LoginForm)
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Identifiants invalides'
            ], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    // DÉCONNEXION
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnecté avec succès'
        ]);
    }

    // RÉCUPÉRER L'UTILISATEUR (Pour ta ProfilCard)
    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}
