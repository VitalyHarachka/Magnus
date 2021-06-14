<?php

namespace App\Http\Controllers;

use App\Campus;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class CampusController extends Controller
{
    public function index()
    {
        $campuses = Campus::with(['buildings', 'buildings.cameras'])->get();

        return response()->json(['data' => $campuses]);
    }

    public function show($id)
    {
        try {
            $campus = Campus::findOrFail($id)->load('buildings');
        } catch (ModelNotFoundException $exception) {
            return response()->json(['error' => 'Campus not found.'], 404);
        }

        return response()->json(['data' => $campus]);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'name'     => 'required|string',
            'address'  => 'required|string',
            'city'     => 'required|string',
            'county'   => 'required|string',
            'postcode' => 'required|string',
        ]);

        $campus = Campus::create($request->only(['name', 'address', 'city', 'county', 'postcode']));

        return response()->json(['success' => 'Campus created.'], 201)
            ->header('Location', route('camera.show', ['id' => $campus->id]));
    }

    public function buildings($id)
    {
        try {
            $campus = Campus::findOrFail($id);
        } catch (ModelNotFoundException $exception) {
            return response()->json(['error' => 'Campus not found.'], 404);
        }

        $buildings = $campus->buildings;

        return response()->json(['data' => ['campus' => $campus, 'buildings' => $buildings]]);
    }
}
