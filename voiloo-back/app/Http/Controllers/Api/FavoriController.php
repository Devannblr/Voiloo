<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Favori;
use Illuminate\Http\Request;

class FavoriController extends Controller
{
    // GET /favoris/ids → IDs uniquement (léger, au montage)
    public function ids(Request $request)
    {
        $ids = $request->user()->favoris()->pluck('annonces.id');
        return response()->json($ids);
    }

    // GET /favoris → liste complète (page favoris)
    public function index(Request $request)
    {
        $annonces = $request->user()
            ->favoris()
            ->with(['images', 'vitrineConfig', 'user'])
            ->withCount('avis')
            ->withAvg('avis', 'note')
            ->get();

        return response()->json($annonces->values());
    }

    // POST /favoris/{annonceId} → toggle add/remove
    public function toggle(Request $request, int $annonceId)
    {
        $user = $request->user();

        $existing = Favori::where('user_id', $user->id)
            ->where('annonce_id', $annonceId)
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json(['status' => 'removed', 'annonce_id' => $annonceId]);
        }

        Favori::create([
            'user_id'    => $user->id,
            'annonce_id' => $annonceId,
        ]);

        return response()->json(['status' => 'added', 'annonce_id' => $annonceId]);
    }
}
