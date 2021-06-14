<?php

namespace App\Http\Controllers;

use App\Camera;
use App\SecurityAlert;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class SecurityAlertsController extends Controller
{
    public function index()
    {
        $alerts = SecurityAlert::with('camera')->get();

        return response()->json(['data' => ['alerts' => $alerts]]);
    }

    public function store(Request $request)
    {
        $data = $this->validate($request, [
            'camera_id' => 'required|numeric',
        ]);

        $alert = SecurityAlert::create([
            'camera_id' => $data['camera_id'],
            'timestamp' => \Carbon\Carbon::now(),
        ]);

        return response()->json(['success' => 'Alert filed.'], 201);
    }

    public function update($id)
    {
        try {
            $alert = SecurityAlert::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Alert was not found.'], 404);
        }

        $alert->mark();

        return response()->json(['success' => 'Alert marked!']);
    }

    public function show($id)
    {
        try {
            $alert = SecurityAlert::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Alert was not found.'], 404);
        }

        return response()->json(['data' => ['alert' => $alert]]);
    }

    public function byCamera($camera)
    {
        try {
            $camera = Camera::findOrFail($camera)->load('alerts');
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Camera was not found.'], 404);
        }

        return response()->json(['data' => ['alerts' => $camera->alerts]]);
    }
}
