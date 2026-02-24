<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Categorie;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        // On utilise orderBy() avant de récupérer les résultats avec get()
        $categories = Categorie::orderBy('nom', 'asc')->get();

        return response()->json($categories);
    }
}
