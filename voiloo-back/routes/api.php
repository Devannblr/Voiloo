<?php

use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AnnonceController;
use App\Http\Controllers\Api\VitrineConfigController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;

// Public
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/annonces', [AnnonceController::class, 'index']);
Route::get('/annonces/{userSlug}/{annonceSlug}/vitrine', [VitrineConfigController::class, 'show']);
Route::get('/annonces/{userSlug}/{annonceSlug}', [AnnonceController::class, 'showBySlug']);
Route::get('/annonces/{id}', [AnnonceController::class, 'show'])->whereNumber('id');
Route::get('/users/{slug}', [UserController::class, 'showBySlug']);
Route::get('/email/verify/{id}/{hash}', [UserController::class, 'verifyEmail'])
    ->name('verification.verify');

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/check-username/{username}', [AuthController::class, 'checkUsername']);
Route::get('/check-email', [AuthController::class, 'checkEmail']);

// Protected
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [UserController::class, 'user']);
    Route::match(['put', 'post'], '/user/update', [UserController::class, 'update']);
    Route::post('/user/change-password', [UserController::class, 'changePassword']);
    Route::delete('/user/delete', [UserController::class, 'deleteAccount']);

    // Email verification
    Route::post('/email/verification-notification', [UserController::class, 'sendVerification']);
    Route::get('/email/verify/{id}/{hash}', [UserController::class, 'verifyEmail'])->name('verification.verify');

    // Annonces
    Route::post('/annonces', [AnnonceController::class, 'store']);
    Route::put('/annonces/{id}', [AnnonceController::class, 'update']);
    Route::delete('/annonces/{id}', [AnnonceController::class, 'destroy']);

    // Vitrine config
    Route::put('/vitrine/{annonceId}', [VitrineConfigController::class, 'update']);
});
