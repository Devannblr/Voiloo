<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Annonce;
use App\Models\VitrineConfig;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VitrineConfigController extends Controller
{
    // GET /annonces/{userSlug}/{annonceSlug}/vitrine
    public function show(string $userSlug, string $annonceSlug)
    {
        $annonce = Annonce::whereHas('user', fn($q) => $q->where('slug', $userSlug))
            ->where('slug', $annonceSlug)
            ->firstOrFail();

        $config = $annonce->vitrineConfig ?? new VitrineConfig([
            'annonce_id' => $annonce->id,
            'user_id'    => $annonce->user_id,
        ]);

        return response()->json($config);
    }

    // PUT /vitrine/{annonceId}
    public function update(Request $request, int $annonceId)
    {
        $annonce = Annonce::findOrFail($annonceId);

        if ($request->user()->id !== $annonce->user_id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }
        
        foreach (['sections', 'options'] as $field) {
            if ($request->has($field) && is_string($request->$field)) {
                $request->merge([$field => json_decode($request->$field, true)]);
            }
        }
        $validated = $request->validate([
            // Couleurs
            'couleur_principale' => 'sometimes|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'couleur_texte'      => 'sometimes|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'couleur_fond'       => 'sometimes|string|regex:/^#[0-9A-Fa-f]{6}$/',
            // Header
            'header_photo'       => 'sometimes|image|mimes:jpeg,png,jpg,webp|max:10240',
            'slogan'             => 'sometimes|nullable|string|max:200',
            // Contenu
            'sections'           => 'sometimes|array',
            // Réseaux
            'instagram'          => 'sometimes|nullable|url|max:255',
            'linkedin'           => 'sometimes|nullable|url|max:255',
            'site_web'           => 'sometimes|nullable|url|max:255',
            'facebook'           => 'sometimes|nullable|url|max:255',
            'twitter'            => 'sometimes|nullable|url|max:255',
            // Options
            'template'           => 'sometimes|string|in:default,minimal,bold,elegant',
            'show_contact_form'  => 'sometimes|boolean',
            'options'            => 'sometimes|array',
        ]);

        // Upload header_photo si présent
        if ($request->hasFile('header_photo')) {
            $user = $request->user();
            $folder = 'vitrines/' . $user->username . '/' . $annonce->slug;
            $file   = $request->file('header_photo');
            $ext    = $file->getClientOriginalExtension() ?: $file->extension();
            $filename = 'header.' . $ext;

            // Supprimer l'ancienne si elle existe
            $oldConfig = VitrineConfig::where('annonce_id', $annonceId)->first();
            if ($oldConfig && $oldConfig->header_photo) {
                $oldPath = str_replace(asset('storage/'), '', $oldConfig->header_photo);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $file->storeAs($folder, $filename, 'public');
            $validated['header_photo'] = asset('storage/' . $path);
        }

        $config = VitrineConfig::updateOrCreate(
            ['annonce_id' => $annonce->id, 'user_id' => $annonce->user_id],
            $validated
        );

        return response()->json([
            'message' => 'Vitrine mise à jour.',
            'config'  => $config,
        ]);
    }
}
