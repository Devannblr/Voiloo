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
        Schema::table('annonces', function (Blueprint $table) {
            // On définit les 3 états possibles
            // On peut aussi mettre 'waiting' par défaut
            $table->enum('status', ['waiting', 'accepted', 'refused'])
                ->default('waiting')
                ->after('code_postal');
            $table->string('adresse')->nullable()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('annonces', function (Blueprint $table) {
            $table->dropColumn('status');
            $table->dropColumn('adresse');
        });
    }
};
