<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Étape 1 : On remplace les NULL existants par la valeur par défaut pour éviter l'erreur de troncature
        DB::table('users')->whereNull('avatar')->update(['avatar' => 'userdefault.png']);

        Schema::table('users', function (Blueprint $table) {
            // Étape 2 : On applique le changement avec nullable(false) si tu veux forcer
            // Mais le plus sûr pour éviter les erreurs SQL est de la laisser nullable
            $table->string('avatar')->default('userdefault.png')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('avatar')->default(null)->nullable()->change();
        });
    }
};
