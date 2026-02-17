<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Annonce;
use App\Models\AnnonceImage; // N'oublie pas de l'importer
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AnnonceController extends Controller
{
    public function index()
    {
        // On récupère les annonces validées avec l'user et TOUTES les images
        $annonces = Annonce::with(['user:id,name,avatar', 'images'])
            ->where('status', 'accepted')
            ->latest()
            ->get();

        return response()->json($annonces);
    }

    public function store(Request $request)
    {
        // 1. Validation stricte
        $validated = $request->validate([
            'title'        => 'required|string|max:100',
            'description'  => 'required|string',
            'price'        => 'required|numeric',
            'category_id'  => 'required|exists:categories,id',
            'ville'        => 'required|string',
            'lat'          => 'required|numeric',
            'lng'          => 'required|numeric',
            'images'       => 'required|array|min:1', // Au moins une image
            'images.*'     => 'image|mimes:jpeg,png,jpg|max:2048', // 2Mo max par image
        ]);

        // 2. Création de l'annonce liée à l'utilisateur connecté
        $annonce = $request->user()->annonces()->create([
            'title'       => $validated['title'],
            'description' => $validated['description'],
            'price'       => $validated['price'],
            'category_id' => $validated['category_id'],
            'ville'       => $validated['ville'],
            'lat'         => $validated['lat'],
            'lng'         => $validated['lng'],
            'status'      => 'waiting', // Par défaut
        ]);

        // 3. Gestion des multiples images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('annonces', 'public');

                // On crée l'entrée dans la table annonce_images
                AnnonceImage::create([
                    'annonce_id' => $annonce->id,
                    'path'       => asset('storage/' . $path),
                ]);
            }
        }

        return response()->json([
            'message' => 'Annonce créée avec succès, en attente de validation.',
            'annonce' => $annonce->load('images')
        ], 201);
    }

    public function show($id)
    {
        $annonce = Annonce::with(['user', 'images', 'category'])->findOrFail($id);
        return response()->json($annonce);
    }

    public function destroy(Request $request, $id)
    {
        $annonce = Annonce::findOrFail($id);

        // Sécurité : Seul le proprio ou un admin peut supprimer
        if ($request->user()->id !== $annonce->user_id && !$request->user()->isAdmin()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        // Supprimer les fichiers physiques du storage avant la ligne en BDD
        foreach ($annonce->images as $image) {
            $oldPath = str_replace(asset('storage/'), '', $image->path);
            Storage::disk('public')->delete($oldPath);
        }

        $annonce->delete();

        return response()->json(['message' => 'Annonce supprimée']);
    }
}
