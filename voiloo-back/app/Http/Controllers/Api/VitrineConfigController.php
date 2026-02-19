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

        // 1. Prétraitement des données FormData
        if ($request->has('show_contact_form')) {
            $request->merge([
                'show_contact_form' => filter_var($request->show_contact_form, FILTER_VALIDATE_BOOLEAN)
            ]);
        }

        foreach (['sections', 'options'] as $field) {
            if ($request->has($field) && is_string($request->$field)) {
                $decoded = json_decode($request->$field, true);
                $request->merge([$field => is_array($decoded) ? $decoded : []]);
            }
        }

        // 2. Validation
        $validated = $request->validate([
            'couleur_principale' => ['sometimes', 'nullable', 'string', 'regex:/^#([A-Fa-f0-9]{3}){1,2}$/'],
            'couleur_texte'      => ['sometimes', 'nullable', 'string', 'regex:/^#([A-Fa-f0-9]{3}){1,2}$/'],
            'couleur_fond'       => ['sometimes', 'nullable', 'string', 'regex:/^#([A-Fa-f0-9]{3}){1,2}$/'],

            // Validation Header
            'header_photo'       => 'sometimes|nullable|image|mimes:jpeg,png,jpg,webp|max:10240',

            // --- AJOUT : Validation Portfolio ---
            'portfolio_images'   => 'sometimes|array',
            'portfolio_images.*' => 'image|mimes:jpeg,png,jpg,webp|max:10240',
            // ------------------------------------

            'slogan'             => 'sometimes|nullable|string|max:200',
            'sections'           => 'sometimes|array',
            'instagram'          => 'sometimes|nullable|string|max:255',
            'linkedin'           => 'sometimes|nullable|string|max:255',
            'site_web'           => 'sometimes|nullable|string|max:255',
            'facebook'           => 'sometimes|nullable|string|max:255',
            'twitter'            => 'sometimes|nullable|string|max:255',
            'template'           => 'sometimes|string|in:default,minimal,bold,elegant',
            'show_contact_form'  => 'sometimes|boolean',
            'options'            => 'sometimes|array',
        ]);

        // 3. Upload header_photo
        if ($request->hasFile('header_photo')) {
            $user = $request->user();
            $folder = 'vitrines/' . $user->username . '/' . $annonce->slug;
            $file   = $request->file('header_photo');
            $filename = 'header.' . $file->getClientOriginalExtension();

            $oldConfig = VitrineConfig::where('annonce_id', $annonceId)->first();
            if ($oldConfig && $oldConfig->header_photo) {
                $oldPath = str_replace(asset('storage/'), '', $oldConfig->header_photo);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $file->storeAs($folder, $filename, 'public');
            $validated['header_photo'] = asset('storage/' . $path);
        }

        // 4. Upload Portfolio
        if ($request->hasFile('portfolio_images')) {
            $user = $request->user();
            $folder = 'annonces/' . $user->username . '/' . $annonce->slug;
            $currentCount = $annonce->images()->count();

            foreach ($request->file('portfolio_images') as $index => $image) {
                $count = $currentCount + $index + 1;
                $number = str_pad($count, 2, '0', STR_PAD_LEFT);
                $extension = $image->getClientOriginalExtension();
                $filename = $number . '-' . $annonce->slug . '.' . $extension;

                $path = $image->storeAs($folder, $filename, 'public');
                $fullUrl = asset('storage/' . $path);

                $annonce->images()->create([
                    'path' => $fullUrl,
                ]);
            }
        }

        // 5. Update ou Create
        $config = VitrineConfig::updateOrCreate(
            ['annonce_id' => $annonce->id, 'user_id' => $annonce->user_id],
            $validated
        );

        return response()->json([
            'message' => 'Vitrine mise à jour.',
            'config'  => $config->fresh(),
            'annonce' => $annonce->load('images'),
        ]);
    }
}
