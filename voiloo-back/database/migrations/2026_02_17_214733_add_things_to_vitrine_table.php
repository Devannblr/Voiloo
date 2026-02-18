<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vitrine_configs', function (Blueprint $table) {
            // Header
            $table->string('header_photo')->nullable()->after('couleur_fond');
            $table->string('slogan')->nullable()->after('header_photo');

            // Sections de contenu (JSON pour flexibilité)
            $table->json('sections')->nullable()->after('slogan');
            // Structure attendue :
            // { "about": "...", "parcours": "...", "services": [...], "portfolio": [...] }

            // Liens sociaux
            $table->string('instagram')->nullable()->after('sections');
            $table->string('linkedin')->nullable()->after('instagram');
            $table->string('site_web')->nullable()->after('linkedin');
            $table->string('facebook')->nullable()->after('site_web');
            $table->string('twitter')->nullable()->after('facebook');

            // Contact
            $table->boolean('show_contact_form')->default(true)->after('twitter');
        });
    }

    public function down(): void
    {
        Schema::table('vitrine_configs', function (Blueprint $table) {
            $table->dropColumn([
                'header_photo', 'slogan', 'sections',
                'instagram', 'linkedin', 'site_web', 'facebook', 'twitter',
                'show_contact_form'
            ]);
        });
    }
};
