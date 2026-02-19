<?php

use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AnnonceController;
use App\Http\Controllers\Api\VitrineConfigController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Catégories et Annonces
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/annonces', [AnnonceController::class, 'index']);
Route::get('/annonces/{userSlug}/{annonceSlug}/vitrine', [VitrineConfigController::class, 'show']);
Route::get('/annonces/{userSlug}/{annonceSlug}', [AnnonceController::class, 'showBySlug']);
Route::get('/annonces/{id}', [AnnonceController::class, 'show'])->whereNumber('id');

// Utilisateurs publics
Route::get('/users/{slug}', [UserController::class, 'showBySlug']);

// Authentification & Inscription
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/check-username/{username}', [AuthController::class, 'checkUsername']);
Route::get('/check-email', [AuthController::class, 'checkEmail']);

// ✅ MOT DE PASSE OUBLIÉ (Public)
// Ces deux routes sont indispensables pour tes nouvelles pages Next.js
Route::post('/forgot-password', [AuthController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Vérification d'email (Le lien cliqué dans le mail)
Route::get('/email/verify/{id}/{hash}', [UserController::class, 'verifyEmail'])
    ->name('verification.verify');

// Divers
Route::post('/contact', [ContactController::class, 'send']);
Route::get('/phpinfo', function() { phpinfo(); });

/*
|--------------------------------------------------------------------------
| Protected Routes (Auth:Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // Session & Compte
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [UserController::class, 'user']);
    Route::match(['put', 'post'], '/user/update', [UserController::class, 'update']);
    Route::post('/user/change-password', [UserController::class, 'changePassword']);
    Route::delete('/user/delete', [UserController::class, 'deleteAccount']);

    // Email verification (Renvoi du lien si non reçu)
    Route::post('/email/verification-notification', [UserController::class, 'sendVerification']);

    // Annonces
    Route::post('/annonces', [AnnonceController::class, 'store']);
    Route::put('/annonces/{id}', [AnnonceController::class, 'update']);
    Route::delete('/annonces/{id}', [AnnonceController::class, 'destroy']);

    // Vitrine config
    Route::put('/vitrine/{annonceId}', [VitrineConfigController::class, 'update']);
});
