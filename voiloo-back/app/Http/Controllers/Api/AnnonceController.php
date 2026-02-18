<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Annonce;
use App\Models\AnnonceImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AnnonceController extends Controller
{
    public function index(Request $request)
    {
        $query = Annonce::with(['user:id,name,avatar', 'images'])
            ->where('status', 'accepted')
            ->latest();

        // Filtre optionnel par slug de catégorie
        if ($request->has('category')) {
            $query->whereHas('categorie', function ($q) use ($request) {
                $q->where('slug', $request->get('category'));
            });
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        // Validation alignée sur les vrais noms de colonnes (migration)
        $validated = $request->validate([
            'titre'          => 'required|string|max:100',
            'description'    => 'required|string|min:20',
            'prix'           => 'required|numeric|min:0',
            'categorie_id'   => 'required|exists:categories,id',
            'ville'          => 'required|string|max:100',
            'code_postal'    => 'required|string|size:5',
            'disponibilites' => 'required|string',
            'lat'            => 'nullable|numeric',
            'lng'            => 'nullable|numeric',
            // photos[] est optionnel mais validé si présent
            'photos'         => 'nullable|array|max:6',
            'photos.*'       => 'image|mimes:jpeg,png,jpg,webp|max:10240',
        ]);

        // Création de l'annonce liée à l'utilisateur connecté
        $annonce = $request->user()->annonces()->create([
            'titre'          => $validated['titre'],
            'description'    => $validated['description'],
            'prix'           => $validated['prix'],
            'categorie_id'   => $validated['categorie_id'],
            'ville'          => $validated['ville'],
            'code_postal'    => $validated['code_postal'],
            'disponibilites' => $validated['disponibilites'],
            'lat'            => $validated['lat'] ?? null,
            'lng'            => $validated['lng'] ?? null,
            'status'         => 'waiting',
        ]);

        // Gestion des photos (optionnelles)
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $file) {
                $path = $file->store('annonces', 'public');
                AnnonceImage::create([
                    'annonce_id' => $annonce->id,
                    'path'       => asset('storage/' . $path),
                ]);
            }
        }

        return response()->json([
            'message' => 'Annonce créée avec succès, en attente de validation.',
            'annonce' => $annonce->load('images'),
        ], 201);
    }

    public function show($id)
    {
        $annonce = Annonce::with(['user', 'images', 'categorie'])->findOrFail($id);
        return response()->json($annonce);
    }

    public function update(Request $request, $id)
    {
        $annonce = Annonce::findOrFail($id);

        if ($request->user()->id !== $annonce->user_id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $validated = $request->validate([
            'titre'          => 'sometimes|string|max:100',
            'description'    => 'sometimes|string|min:20',
            'prix'           => 'sometimes|numeric|min:0',
            'categorie_id'   => 'sometimes|exists:categories,id',
            'ville'          => 'sometimes|string|max:100',
            'code_postal'    => 'sometimes|string|size:5',
            'disponibilites' => 'sometimes|string',
            'lat'            => 'nullable|numeric',
            'lng'            => 'nullable|numeric',
        ]);

        $annonce->update($validated);

        return response()->json([
            'message' => 'Annonce mise à jour.',
            'annonce' => $annonce->load('images'),
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $annonce = Annonce::findOrFail($id);

        if ($request->user()->id !== $annonce->user_id && !$request->user()->isAdmin()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        // Suppression des fichiers physiques
        foreach ($annonce->images as $image) {
            $relativePath = str_replace(asset('storage/'), '', $image->path);
            Storage::disk('public')->delete($relativePath);
        }

        $annonce->delete();

        return response()->json(['message' => 'Annonce supprimée']);
    }
}
