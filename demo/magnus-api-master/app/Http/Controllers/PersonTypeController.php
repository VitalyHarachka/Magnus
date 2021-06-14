<?php

namespace App\Http\Controllers;

use App\PersonType;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class PersonTypeController extends Controller
{
    public function show($id)
    {
        try {
            $personType = PersonType::findOrFail($id);
        } catch (ModelNotFoundException $exception) {
            return response()->json(['error' => 'Peron Type not found.'], 404);
        }

        return response()->json(['data' => ['type' => $personType]]);
    }

    public function listing($id)
    {
        try {
            $personType = PersonType::findOrFail($id)->load('people');
        } catch (ModelNotFoundException $exception) {
            return response()->json(['error' => 'Peron Type not found.'], 404);
        }

        return response()->json(['data' => ['type' => $personType]]);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|string|min:3',
        ]);

        $personType = PersonType::create($request->only('name'));

        return response()->json(['success' => 'Person Type created.'], 201)
            ->header('Location', route('person.type.show', ['id' => $personType->id]));
    }
}
