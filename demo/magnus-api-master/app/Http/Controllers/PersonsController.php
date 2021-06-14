<?php

namespace App\Http\Controllers;

use App\Person;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class PersonsController extends Controller
{
    /** @var Person */
    private $person;

    public function __construct(Person $person)
    {
        $this->person = $person;
    }

    public function show($id)
    {
        try {
            $person = Person::findOrFail($id);
        } catch (ModelNotFoundException $exception) {
            return response()->json(['error' => 'Person not found.'], 404);
        }

        return response()->json(['data' => ['person' => $person]]);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'identifier' => 'required|string',
            'type_id'    => 'required|numeric',
        ]);

        $person = Person::create($request->only(['identifier', 'type_id']));

        return response()->json(['success' => 'Person created.'], 201)
                ->header('Location', route('person.show', ['id' => $person->id]));
    }
}
