<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vitrine_configs', function (Blueprint $table) {
            $table->id();

            // Relations
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('annonce_id')->constrained()->onDelete('cascade')->unique();
            // unique() : une config par annonce

            // Couleurs (extensible)
            $table->string('couleur_principale', 7)->default('#FFD359'); // hex
            $table->string('couleur_texte', 7)->default('#1A1A1A');
            $table->string('couleur_fond', 7)->default('#FFFFFF');

            // Template (pour les futures variantes de mise en page)
            $table->string('template')->default('default');
            // Valeurs possibles futures : 'default', 'minimal', 'bold', 'elegant'

            // Options futures (stockées en JSON pour flexibilité)
            // Ex : { "show_map": true, "show_reviews": true, "layout": "grid" }
            $table->json('options')->nullable();

            $table->timestamps();
        });

        // On supprime couleur_vitrine de annonces (migrée dans vitrine_configs)
        Schema::table('annonces', function (Blueprint $table) {
            if (Schema::hasColumn('annonces', 'couleur_vitrine')) {
                $table->dropColumn('couleur_vitrine');
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vitrine_configs');

        Schema::table('annonces', function (Blueprint $table) {
            $table->string('couleur_vitrine', 7)->default('#FFD359')->after('disponibilites');
        });
    }
};
