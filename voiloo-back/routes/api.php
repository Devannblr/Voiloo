<?php

use App\Http\Controllers\Api\AvisController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\FavoriController;
use App\Http\Controllers\Api\MessageController;
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

// Vitrine & Détails
Route::get('/annonces/{userSlug}/{annonceSlug}/vitrine', [AnnonceController::class, 'getVitrineConfig']);
Route::get('/annonces/map', [AnnonceController::class, 'getMapPoints']);
Route::get('/annonces/recommended', [AnnonceController::class, 'getRecommended']);
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

// Mot de passe oublié
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
    Route::get('/me', [UserController::class, 'me']);
    Route::match(['put', 'post'], '/user/update', [UserController::class, 'update']);
    Route::post('/user/change-password', [UserController::class, 'changePassword']);
    Route::delete('/user/delete', [UserController::class, 'deleteAccount']);

    // Email verification
    Route::post('/email/verification-notification', [UserController::class, 'sendVerification']);

    // Annonces & Favoris
    Route::post('/annonces', [AnnonceController::class, 'store']);
    Route::put('/annonces/{id}', [AnnonceController::class, 'update']);
    Route::delete('/annonces/{id}', [AnnonceController::class, 'destroy']);
    Route::post('/annonces/{id}/avis', [AvisController::class, 'store']);
    Route::put('/vitrine/{annonceId}', [VitrineConfigController::class, 'update']);

    Route::get('/favoris', [FavoriController::class, 'index']);
    Route::get('/favoris/ids', [FavoriController::class, 'ids']);
    Route::post('/favoris/{annonceId}', [FavoriController::class, 'toggle']);

    Route::get('/conversations',                    [MessageController::class, 'conversations']);
    Route::post('/conversations',                   [MessageController::class, 'startOrGet']);
    Route::get('/conversations/{id}/messages',      [MessageController::class, 'messages']);
    Route::post('/conversations/{id}/messages',     [MessageController::class, 'send']);
    Route::post('/conversations/{id}/read',         [MessageController::class, 'markAsRead']);
    Route::get('/messages/unread-count',            [MessageController::class, 'unreadCount']);
    Route::delete('/messages/{id}',                 [MessageController::class, 'deleteMessage']);
});
