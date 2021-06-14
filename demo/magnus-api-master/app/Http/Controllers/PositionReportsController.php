<?php

namespace App\Http\Controllers;

use App\Repositories\PositionReportsRepository;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class PositionReportsController extends Controller
{
    private $repository;

    public function __construct(PositionReportsRepository $reportsRepository)
    {
        $this->repository = $reportsRepository;
    }

    public function success(Request $request)
    {
        try {
            $this->repository->success($request->only(['camera_id', 'person_id', 'notes', 'type', 'type_id']));
        } catch (ModelNotFoundException $exception) {
            return $this->invalidCameraError();
        }

        return response()->json(['success' => 'Successful position report filed.'], 201);
    }

    public function unsuccessful(Request $request)
    {
        try {
            $this->repository->unsuccessful($request->only(['camera_id', 'person_id', 'notes']));
        } catch (ModelNotFoundException $exception) {
            return $this->invalidCameraError();
        }

        return response()->json(['success' => 'Unsuccessful position report filed.'], 201);
    }

    private function invalidCameraError()
    {
        return response()->json(['error' => 'Invalid camera detected'], 422);
    }
}
