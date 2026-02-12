<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Categorie;
use Illuminate\Support\Str;

class CategorieSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */

    public function run(): void
    {
        $categories = [
            'Bricolage', 'Jardinage', 'Ménage', 'Déménagement', 'Peinture',
            'Plomberie', 'Électricité', 'Mécanique', 'Baby-sitting', 'Aide aux seniors',
            'Soutien scolaire', 'Garde d’animaux', 'Coiffure', 'Esthétique', 'Cuisine',
            'Informatique', 'Graphisme', 'Photographie', 'Rédaction', 'Marketing',
            'Développement Web', 'Cours de musique', 'Coaching sportif', 'Yoga',
            'Animation', 'DJ', 'Location de matériel', 'Couture', 'Livraison', 'Transport'
        ];

        foreach ($categories as $cat) {
            Categorie::create([
                'nom' => $cat,
                'slug' => Str::slug($cat), // Transforme "Aide aux seniors" en "aide-aux-seniors"
            ]);
        }
    }
}
