<?php

namespace App\Http\Controllers;

use App\Building;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class BuildingController extends Controller
{
    public function show($id)
    {
        $building = $this->retrieveOrFail($id)->load(['cameras']);

        return response()->json(['data' => ['building' => $building]]);
    }

    public function cameras($id)
    {
        try {
            $building = Building::findOrFail($id)->load(['cameras']);
        } catch (ModelNotFoundException $exception) {
            return response()->json(['error' => 'Building not found.'], 404);
        }

        return response()->json(['data' => ['building' => $building, 'cameras' => $building->cameras]]);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'name'      => 'required|string',
            'campus_id' => 'required|numeric',
        ]);

        $building = Building::create($request->only(['name', 'campus_id']));

        return response()->json(['success' => 'Building created.'], 201)
            ->header('Location', route('building.show', ['id' => $building->id]));
    }

    private function retrieveOrFail($id)
    {
        try {
            $building = Building::findOrFail($id);
        } catch (ModelNotFoundException $exception) {
            return response()->json(['error' => 'Building not found.'], 404);
        }

        return $building;
    }
}
