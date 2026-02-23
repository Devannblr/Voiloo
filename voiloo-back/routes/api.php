<?php

use App\Http\Controllers\Api\AvisController;
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

// ✅ CORRECTION : Une seule route pour la vitrine, pointant vers AnnonceController qui est à jour
Route::get('/annonces/{userSlug}/{annonceSlug}/vitrine', [AnnonceController::class, 'getVitrineConfig']);

Route::get('/annonces/{userSlug}/{annonceSlug}', [AnnonceController::class, 'showBySlug']);
Route::get('/annonces/{id}', [AnnonceController::class, 'show'])->whereNumber('id');

// Utilisateurs publics
Route::get('/users/{slug}', [UserController::class, 'showBySlug']);
Route::get('/search/suggestions', [AnnonceController::class, 'suggestions']);

// Authentification & Inscription
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/check-username/{username}', [AuthController::class, 'checkUsername']);
Route::get('/check-email', [AuthController::class, 'checkEmail']);

// ✅ MOT DE PASSE OUBLIÉ
Route::post('/forgot-password', [AuthController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Vérification d'email
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

    // Email verification
    Route::post('/email/verification-notification', [UserController::class, 'sendVerification']);

    // Annonces
    Route::post('/annonces', [AnnonceController::class, 'store']);
    Route::put('/annonces/{id}', [AnnonceController::class, 'update']);
    Route::delete('/annonces/{id}', [AnnonceController::class, 'destroy']);
    Route::post('/annonces/{id}/avis', [AvisController::class, 'store']);
    // Vitrine config (Update reste ici, c'est OK)
    Route::put('/vitrine/{annonceId}', [VitrineConfigController::class, 'update']);
});
