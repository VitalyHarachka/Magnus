<?php

namespace App\Http\Controllers;

use App\Camera;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class CamerasController extends Controller
{
    public function all()
    {
        $cameras = Camera::with(['building'])->get();

        return response()->json(['data' => ['cameras' => $cameras]]);
    }

    public function show($id)
    {
        try {
            $camera = Camera::findOrFail($id)->load(['building']);
        } catch (ModelNotFoundException $exception) {
            return response()->json(['error' => 'Camera with that key is not found.'], 404);
        }

        return response()->json(['data' => ['camera' => $camera, 'building' => $camera->building]]);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'name'           => 'required|string|min:3',
            'camera_address' => 'required|string',
            'building_id'    => 'required|numeric',
        ]);

        $token = sha1(str_random(32));

        $camera = Camera::create(array_merge($request->only(['name', 'camera_address', 'building_id']), ['token' => $token]));

        return response()->json(['token' => $token, 'camera' => $camera], 201)
            ->header('Location', route('camera.show', $camera));
    }
}
