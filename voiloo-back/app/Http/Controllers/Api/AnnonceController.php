<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Annonce;
use App\Models\AnnonceImage;
use App\Models\User;
use App\Models\VitrineConfig;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AnnonceController extends Controller
{
    public function index(Request $request)
    {
        // ✅ CORRECTION : On demande 'username' à la place de 'slug'
        $query = Annonce::with(['user:id,name,avatar,username', 'images', 'vitrineConfig'])
            ->latest();

        if ($request->has('category')) {
            $query->whereHas('categorie', function ($q) use ($request) {
                $q->where('slug', $request->get('category'));
            });
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titre'              => 'required|string|max:100',
            'description'        => 'required|string|min:20',
            'prix'               => 'required|numeric|min:0',
            'categorie_id'       => 'required|exists:categories,id',
            'ville'              => 'required|string|max:100',
            'code_postal'        => 'required|string|size:5',
            'disponibilites'     => 'required|string',
            'lat'                => 'nullable|numeric',
            'lng'                => 'nullable|numeric',
            'photos'             => 'nullable|array|max:6',
            'photos.*'           => 'image|mimes:jpeg,png,jpg,webp,heic,heif|max:20480',
            'couleur_principale' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'couleur_texte'      => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'couleur_fond'       => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
        ]);

        $baseSlug = Str::slug($validated['titre']);
        $slug = $baseSlug;
        $i = 1;
        while (Annonce::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $i++;
        }

        $user = $request->user();
        // ✅ CORRECTION : Suppression de la mise à jour automatique du user->slug

        $annonce = $user->annonces()->create([
            'titre'          => $validated['titre'],
            'slug'           => $slug,
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

        VitrineConfig::create([
            'annonce_id'         => $annonce->id,
            'user_id'            => $user->id,
            'couleur_principale' => $validated['couleur_principale'] ?? '#FFD359',
            'couleur_texte'      => $validated['couleur_texte']      ?? '#1A1A1A',
            'couleur_fond'       => $validated['couleur_fond']        ?? '#FFFFFF',
            'template'           => 'default',
        ]);

        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $index => $file) {
                $folder    = 'annonces/' . $user->username . '/' . $slug;
                $extension = $file->getClientOriginalExtension() ?: $file->extension();
                $filename  = str_pad($index + 1, 2, '0', STR_PAD_LEFT) . '-' . $slug . '.' . $extension;

                $path = $file->storeAs($folder, $filename, 'public');

                AnnonceImage::create([
                    'annonce_id' => $annonce->id,
                    'path'       => 'storage/' . $path,
                ]);
            }
        }

        return response()->json([
            'message'   => 'Annonce créée, en attente de validation.',
            'annonce'   => $annonce->load(['images', 'vitrineConfig']),
            'user_username' => $user->username, // ✅ Changé de user_slug à user_username
        ], 201);
    }

    public function showBySlug(string $userSlug, string $annonceSlug)
    {
        $annonce = Annonce::with([
            'user',
            'images',
            'categorie',
            'avis.user:id,name,avatar,username', // ✅ Changé slug -> username
            'vitrineConfig',
        ])
            // ✅ CORRECTION : On filtre par username (qui correspond au userSlug de l'URL)
            ->whereHas('user', fn($q) => $q->where('username', $userSlug))
            ->where('slug', $annonceSlug)
            ->firstOrFail();

        return response()->json($annonce);
    }

    public function show($id)
    {
        $annonce = Annonce::with(['user', 'images', 'categorie', 'avis', 'vitrineConfig'])->findOrFail($id);
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
            'prix'               => 'sometimes|numeric|min:0',
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
            'annonce' => $annonce->load(['images', 'vitrineConfig']),
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $annonce = Annonce::findOrFail($id);

        if ($request->user()->id !== $annonce->user_id && !$request->user()->isAdmin()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        foreach ($annonce->images as $image) {
            $relativePath = str_replace(url('storage/'), '', $image->path);
            Storage::disk('public')->delete($relativePath);
        }

        $annonce->delete();

        return response()->json(['message' => 'Annonce supprimée']);
    }
}
