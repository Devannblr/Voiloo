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
use Illuminate\Support\Facades\Log;
use File;

class AnnonceController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Annonce::with([
                'user:id,name,avatar,username',
                'images',
                'vitrineConfig',
                'categorie'
            ])
                ->withCount('avis')
                ->withAvg('avis', 'note')
                ->where('status', 'active');

            // 🔎 Filtre catégorie
            if ($request->filled('category')) {
                $query->whereHas('categorie', function ($q) use ($request) {
                    $q->where('slug', $request->category);
                });
            }

            // 🔎 Recherche globale (CORRIGÉ ICI)
            if ($request->filled('query')) {
                // On récupère la valeur en string, pas l'objet InputBag
                $searchValue = $request->query('query');
                $search = is_string($searchValue) ? strtolower($searchValue) : '';

                if (!empty($search)) {
                    $query->where(function ($q) use ($search) {
                        $q->whereRaw('LOWER(titre) LIKE ?', ["%{$search}%"])
                            ->orWhereRaw('LOWER(description) LIKE ?', ["%{$search}%"])
                            ->orWhereRaw('LOWER(ville) LIKE ?', ["%{$search}%"]);
                    });
                }
            }

            // 🏙 Ville spécifique
            if ($request->filled('city')) {
                $cityValue = $request->query('city');
                $city = is_string($cityValue) ? strtolower($cityValue) : '';
                $query->whereRaw('LOWER(ville) LIKE ?', ["%{$city}%"]);
            }

            // 💰 Tri dynamique
            if ($request->filled('sort')) {
                switch ($request->sort) {
                    case 'price_asc':
                        $query->orderBy('prix', 'asc');
                        break;
                    case 'price_desc':
                        $query->orderBy('prix', 'desc');
                        break;
                    case 'rating_desc':
                        $query->orderBy('avis_avg_note', 'desc');
                        break;
                    default:
                        $query->latest();
                        break;
                }
            } else {
                $query->latest();
            }

            return response()->json($query->paginate(12));

        } catch (\Exception $e) {
            Log::error("Erreur Recherche Annonces: " . $e->getMessage());
            return response()->json([
                'error' => 'Erreur serveur',
                'message' => $e->getMessage()
            ], 500);
        }
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
            'status' => 'active',
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
                $filename  = str_pad($index + 1, 2, '0', STR_PAD_LEFT) . '-' . $annonce->id . '-' . $slug . '.' . $extension;

                $path = $file->storeAs($folder, $filename, 'public');

                AnnonceImage::create([
                    'annonce_id' => $annonce->id,
                    'path'       => 'storage/' . $path,
                ]);
            }
        }

        return response()->json([
            'message'   => 'Annonce créée avec succès.',
            'annonce'   => $annonce->load(['images', 'vitrineConfig']),
            'user_username' => $user->username,
        ], 201);
    }

    public function showBySlug(string $userSlug, string $annonceSlug)
    {
        $annonce = Annonce::with([
            'user',
            'images',
            'categorie',
            'avis.user:id,name,avatar,username',
            'vitrineConfig',
        ])
            ->whereHas('user', fn($q) => $q->where('username', $userSlug))
            ->where('slug', $annonceSlug)
            ->firstOrFail();

        return response()->json($annonce);
    }

    public function getVitrineConfig(string $userSlug, string $annonceSlug)
    {
        $annonce = Annonce::where('slug', $annonceSlug)
            ->whereHas('user', fn($q) => $q->where('username', $userSlug))
            ->firstOrFail();

        $config = VitrineConfig::where('annonce_id', $annonce->id)->firstOrFail();

        return response()->json($config);
    }

    public function show($id)
    {
        $annonce = Annonce::with(['user', 'images', 'categorie', 'avis', 'vitrineConfig'])->findOrFail($id);
        return response()->json($annonce);
    }

    public function update(Request $request, $id)
    {
        $annonce = Annonce::with(['user', 'images'])->findOrFail($id);

        if ($request->user()->id !== $annonce->user_id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $validated = $request->validate([
            'titre'          => 'sometimes|string|max:100',
            'description'    => 'sometimes|string|min:20',
            'prix'           => 'sometimes|numeric|min:0',
            'categorie_id'   => 'sometimes|exists:categories,id',
            'adresse'        => 'nullable|string|max:255',
            'ville'          => 'sometimes|string|max:100',
            'code_postal'    => 'sometimes|string|size:5',
            'disponibilites' => 'sometimes|string',
            'lat'            => 'nullable|numeric',
            'lng'            => 'nullable|numeric',
        ]);

        $oldSlug = $annonce->slug;
        $newSlug = $oldSlug;

        if (isset($validated['titre']) && $validated['titre'] !== $annonce->titre) {
            $baseSlug = Str::slug($validated['titre']);
            $newSlug = $baseSlug;
            $i = 1;
            while (Annonce::where('slug', $newSlug)->where('id', '!=', $annonce->id)->exists()) {
                $newSlug = $baseSlug . '-' . $i++;
            }
        }

        if ($newSlug !== $oldSlug) {
            $username = $annonce->user->username;
            $basePath = storage_path("app/public/annonces/{$username}");

            clearstatcache();

            $oldPath = $basePath . "/" . $oldSlug;
            $newPath = $basePath . "/" . $newSlug;

            if (File::exists($oldPath)) {
                File::move($oldPath, $newPath);
                $files = File::files($newPath);
                foreach ($files as $file) {
                    $oldFileName = $file->getFilename();
                    $newFileName = str_replace($oldSlug, $newSlug, $oldFileName);
                    if ($oldFileName !== $newFileName) {
                        File::move($file->getRealPath(), $newPath . '/' . $newFileName);
                    }
                }
                foreach ($annonce->images as $image) {
                    $dbPath = $image->path;
                    $dbPath = str_replace("/{$oldSlug}/", "/{$newSlug}/", $dbPath);
                    $dbPath = str_replace("-{$oldSlug}.", "-{$newSlug}.", $dbPath);
                    $image->update(['path' => $dbPath]);
                }
            }
            $annonce->slug = $newSlug;
        }

        $annonce->update($validated);

        return response()->json([
            'message'  => 'Annonce mise à jour.',
            'annonce'  => $annonce->load(['images', 'vitrineConfig']),
            'new_slug' => $annonce->slug
        ]);
    }
// À ajouter dans AnnonceController.php

    public function suggestions(Request $request)
    {
        $search = $request->query('query');
        if (!$search) return response()->json([]);

        $results = [];

        // --- LOGIQUE POWER USER (u: ou a:) ---
        if (str_starts_with($search, 'u:')) {
            $cleanSearch = ltrim(str_replace('u:', '', $search));
            $results = User::where('name', 'LIKE', "%{$cleanSearch}%")
                ->orWhere('username', 'LIKE', "%{$cleanSearch}%")
                ->select('id', 'name', 'username', 'avatar')
                ->limit(5)
                ->get()
                ->map(fn($u) => [
                    'type' => 'user',
                    'title' => $u->name,
                    'subtitle' => "@{$u->username}",
                    'url' => "/u/{$u->username}",
                    'avatar' => $u->avatar,
                    'id' => $u->id
                ]);
        }
        elseif (str_starts_with($search, 'a:')) {
            $cleanSearch = ltrim(str_replace('a:', '', $search));
            $results = Annonce::where('titre', 'LIKE', "%{$cleanSearch}%")
                ->where('status', 'active')
                ->with('user')
                ->limit(5)
                ->get()
                ->map(fn($a) => [
                    'type' => 'annonce',
                    'title' => $a->titre,
                    'subtitle' => $a->user->name,
                    'url' => "/u/{$a->user->username}/{$a->slug}",
                    'price' => $a->prix,
                    'id' => $a->id
                ]);
        }
        else {
            // --- RECHERCHE MIXTE PAR DÉFAUT ---
            $users = User::where('name', 'LIKE', "%{$search}%")
                ->select('id', 'name', 'username', 'avatar')
                ->limit(3)
                ->get()
                ->map(fn($u) => [
                    'type' => 'user',
                    'title' => $u->name,
                    'subtitle' => 'Freelance',
                    'url' => "/u/{$u->username}",
                    'avatar' => $u->avatar
                ]);

            $annonces = Annonce::where('titre', 'LIKE', "%{$search}%")
                ->with('user')
                ->limit(3)
                ->get()
                ->map(fn($a) => [
                    'type' => 'annonce',
                    'title' => $a->titre,
                    'subtitle' => $a->user->name,
                    'url' => "/u/{$a->user->username}/{$a->slug}",
                    'price' => $a->prix
                ]);

            $results = $users->concat($annonces);
        }

        return response()->json($results);
    }
    public function destroy(Request $request, $id)
    {
        $annonce = Annonce::with('user')->findOrFail($id);

        if ($request->user()->id !== $annonce->user_id && !$request->user()->isAdmin()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $folderPath = storage_path("app/public/annonces/{$annonce->user->username}/{$annonce->slug}");
        if (File::exists($folderPath)) {
            File::deleteDirectory($folderPath);
        }

        $annonce->delete();

        return response()->json(['message' => 'Annonce supprimée']);
    }
}
