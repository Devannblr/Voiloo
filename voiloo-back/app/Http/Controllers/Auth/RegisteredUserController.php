<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): Response
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', 'unique:'.User::class, "alpha_dash"],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],

            // On enlève les fausses règles 'avatar', 'bio', etc.
            'avatar'       => ['nullable', 'string', 'max:255'],
            'bio'          => ['nullable', 'string'],
            'avis'          => ['nullable', 'decimal'],
            'localisation' => ['nullable', 'string', 'max:255'],
            'date_naissance' => ['nullable', 'date'],
        ]);

        $user = User::create([
            'name'           => $request->name,
            'username'           => $request->username,
            'email'          => $request->email,
            'password'       => Hash::make($request->password),
            'avatar'         => $request->avatar,
            'bio'            => $request->bio,
            'avis'           => $request->avis,
            'localisation'   => $request->localisation,
            'date_naissance' => $request->date_naissance,
            'role'           => 'user',
        ]);

        event(new Registered($user));

        Auth::login($user);

        return response()->noContent();
    }
}
