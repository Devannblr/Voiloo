<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FreelanceController;
use App\Http\Controllers\Api\CategoryController;


Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

/*
|--------------------------------------------------------------------------
| API Routes - Voiloo
|--------------------------------------------------------------------------
*/

// --- Routes Publiques ---
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/annonces', [AnnonceController::class, 'index']); // Pour ta FreelanceGrid
Route::get('/annonces/{id}', [AnnonceController::class, 'show']);

// --- Authentification ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/check-username/{username}', [AuthController::class, 'checkUsername']);
// routes/api.php
Route::get('/check-email', [AuthController::class, 'checkEmail']);

// --- Routes Protégées ---
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user/update', [AuthController::class, 'update']);
    // Gestion des annonces
    Route::post('/annonces', [AnnonceController::class, 'store']);
    Route::put('/annonces/{id}', [AnnonceController::class, 'update']);
    Route::delete('/annonces/{id}', [AnnonceController::class, 'destroy']);
});
