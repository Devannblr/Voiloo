<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Annonce;
use App\Models\AnnonceImage;
use App\Models\VitrineConfig;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VitrineConfigController extends Controller
{
    public function show(string $userSlug, string $annonceSlug)
    {
        $annonce = Annonce::whereHas('user', fn($q) => $q->where('username', $userSlug))
            ->where('slug', $annonceSlug)
            ->firstOrFail();

        $config = $annonce->vitrineConfig ?? new VitrineConfig([
            'annonce_id' => $annonce->id,
            'user_id'    => $annonce->user_id,
        ]);

        return response()->json($config);
    }

    public function update(Request $request, int $annonceId)
    {
        $annonce = Annonce::findOrFail($annonceId);

        if ($request->user()->id !== $annonce->user_id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        // 1. Décodage des JSON
        foreach (['sections', 'options', 'portfolio_images_to_delete'] as $field) {
            if ($request->has($field) && is_string($request->$field)) {
                $decoded = json_decode($request->$field, true);
                $request->merge([$field => is_array($decoded) ? $decoded : []]);
            }
        }

        $config = VitrineConfig::firstOrNew(['annonce_id' => $annonce->id, 'user_id' => $annonce->user_id]);

        // 2. SUPPRESSION HEADER
        $shouldDeleteHeader = filter_var($request->input('delete_header_photo'), FILTER_VALIDATE_BOOLEAN);
        if ($shouldDeleteHeader && $config->header_photo) {
            $oldPath = str_replace([asset('storage/'), 'storage/'], '', $config->header_photo);
            Storage::disk('public')->delete($oldPath);
            $config->header_photo = null;
        }

        // 3. SUPPRESSION PORTFOLIO (Physique)
        if ($request->has('portfolio_images_to_delete')) {
            $idsToDelete = $request->input('portfolio_images_to_delete');
            $images = AnnonceImage::whereIn('id', $idsToDelete)->where('annonce_id', $annonce->id)->get();

            foreach ($images as $img) {
                $path = str_replace([asset('storage/'), 'storage/'], '', $img->path);
                Storage::disk('public')->delete($path);
                $img->delete();
            }
        }

        // 4. UPLOAD HEADER (Nom avec time prefix)
        if ($request->hasFile('header_photo')) {
            $folder = 'vitrines/' . $request->user()->username . '/' . $annonce->slug;
            $file = $request->file('header_photo');
            $timePrefix = substr(time(), 0, 4);
            $filename = 'header-' . $timePrefix . '.' . $file->getClientOriginalExtension();

            if ($config->header_photo) {
                $oldPath = str_replace([asset('storage/'), 'storage/'], '', $config->header_photo);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $file->storeAs($folder, $filename, 'public');
            $config->header_photo = $path; // Enregistre "vitrines/..."
        }

        // 5. UPLOAD PORTFOLIO (Nom : XX-TIME-SLUG.EXT)
        if ($request->hasFile('portfolio_images')) {
            $user = $request->user();
            $folder = 'annonces/' . $user->username . '/' . $annonce->slug;
            $currentCount = $annonce->images()->count();
            $timePrefix = substr(time(), 0, 4);

            foreach ($request->file('portfolio_images') as $index => $image) {
                $count = $currentCount + $index + 1;
                $number = str_pad($count, 2, '0', STR_PAD_LEFT);
                $filename = $number . '-' . $timePrefix . '-' . $annonce->slug . '.' . $image->getClientOriginalExtension();

                $path = $image->storeAs($folder, $filename, 'public');

                $annonce->images()->create([
                    'path' => $path, // Enregistre "annonces/..."
                ]);
            }
        }

        // 6. Sauvegarde reste des données
        $config->fill($request->only([
            'couleur_principale', 'couleur_texte', 'couleur_fond',
            'slogan', 'sections', 'template', 'options'
        ]));

        if ($request->has('show_contact_form')) {
            $config->show_contact_form = filter_var($request->show_contact_form, FILTER_VALIDATE_BOOLEAN);
        }

        $config->save();

        return response()->json([
            'message' => 'Vitrine mise à jour.',
            'config'  => $config->fresh(),
            'annonce' => $annonce->load('images'),
        ]);
    }
}
