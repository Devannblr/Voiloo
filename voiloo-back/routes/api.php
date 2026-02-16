<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FreelanceController;
use App\Http\Controllers\Api\CategoryController;

/*
|--------------------------------------------------------------------------
| API Routes - Voiloo
|--------------------------------------------------------------------------
*/

// --- Routes Publiques ---
Route::get('/categories', [CategoryController::class, 'index']);
// Route::get('/annonces', [AnnonceController::class, 'index']); // Attention : AnnonceController n'est pas importé en haut
// Route::get('/annonces/{id}', [AnnonceController::class, 'show']);

// --- Authentification ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/check-username/{username}', [AuthController::class, 'checkUsername']);
Route::get('/check-email', [AuthController::class, 'checkEmail']);

// --- Routes Protégées ---
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // --- LA CORRECTION EST ICI ---
    // On autorise POST pour l'avatar et PUT pour le texte
    Route::match(['put', 'post'], '/user/update', [AuthController::class, 'update']);

    // Gestion des annonces
    // Route::post('/annonces', [AnnonceController::class, 'store']);
    // Route::put('/annonces/{id}', [AnnonceController::class, 'update']);
    // Route::delete('/annonces/{id}', [AnnonceController::class, 'destroy']);
});
